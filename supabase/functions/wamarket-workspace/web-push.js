// RFC 8291 aes128gcm and RFC 8292 VAPID, using the runtime's Web Crypto API.
const utf8 = (s) => new TextEncoder().encode(s);
export const encode64 = (bytes) =>
  btoa(String.fromCharCode(...new Uint8Array(bytes)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
export const decode64 = (s) =>
  Uint8Array.from(atob(s.replace(/-/g, "+").replace(/_/g, "/")), (c) =>
    c.charCodeAt(0),
  );
const join = (...parts) => {
  const out = new Uint8Array(parts.reduce((n, a) => n + a.length, 0));
  let at = 0;
  for (const p of parts) {
    out.set(p, at);
    at += p.length;
  }
  return out;
};
export function validSubscription(s) {
  try {
    const u = new URL(s.endpoint);
    const host = u.hostname;
    return (
      u.protocol === "https:" &&
      !u.username &&
      !u.password &&
      !u.port &&
      (host === "fcm.googleapis.com" ||
        host === "updates.push.services.mozilla.com" ||
        host.endsWith(".push.services.mozilla.com") ||
        host.endsWith(".push.apple.com") ||
        host.endsWith(".notify.windows.com")) &&
      s.endpoint.length < 3000 &&
      decode64(s.keys.p256dh).length === 65 &&
      decode64(s.keys.auth).length === 16
    );
  } catch {
    return false;
  }
}
export async function newVapidKeys() {
  const key = await crypto.subtle.generateKey(
    { name: "ECDSA", namedCurve: "P-256" },
    true,
    ["sign", "verify"],
  );
  return {
    publicKey: encode64(await crypto.subtle.exportKey("raw", key.publicKey)),
    privateJwk: await crypto.subtle.exportKey("jwk", key.privateKey),
  };
}
async function hkdf(ikm, salt, info, size) {
  const key = await crypto.subtle.importKey("raw", ikm, "HKDF", false, [
    "deriveBits",
  ]);
  return new Uint8Array(
    await crypto.subtle.deriveBits(
      { name: "HKDF", hash: "SHA-256", salt, info },
      key,
      size * 8,
    ),
  );
}
export async function encryptPush(subscription, payload) {
  const receiver = decode64(subscription.keys.p256dh);
  const pair = await crypto.subtle.generateKey(
    { name: "ECDH", namedCurve: "P-256" },
    true,
    ["deriveBits"],
  );
  const sender = new Uint8Array(
    await crypto.subtle.exportKey("raw", pair.publicKey),
  );
  const publicKey = await crypto.subtle.importKey(
    "raw",
    receiver,
    { name: "ECDH", namedCurve: "P-256" },
    false,
    [],
  );
  const secret = await crypto.subtle.deriveBits(
    { name: "ECDH", public: publicKey },
    pair.privateKey,
    256,
  );
  const ikm = await hkdf(
    secret,
    decode64(subscription.keys.auth),
    join(utf8("WebPush: info\0"), receiver, sender),
    32,
  );
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const cek = await hkdf(ikm, salt, utf8("Content-Encoding: aes128gcm\0"), 16);
  const nonce = await hkdf(ikm, salt, utf8("Content-Encoding: nonce\0"), 12);
  const text = utf8(JSON.stringify(payload));
  if (text.length > 3000) throw Error("Push payload is too large");
  const key = await crypto.subtle.importKey("raw", cek, "AES-GCM", false, [
    "encrypt",
  ]);
  const encrypted = new Uint8Array(
    await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: nonce },
      key,
      join(text, new Uint8Array([2])),
    ),
  );
  const header = new Uint8Array(5);
  new DataView(header.buffer).setUint32(0, 4096);
  header[4] = sender.length;
  return join(salt, header, sender, encrypted);
}
export async function sendWebPush(
  subscription,
  payload,
  vapid,
  fetcher = fetch,
) {
  if (!validSubscription(subscription))
    throw Error("Invalid push subscription");
  const signingKey = await crypto.subtle.importKey(
    "jwk",
    vapid.privateJwk,
    { name: "ECDSA", namedCurve: "P-256" },
    false,
    ["sign"],
  );
  const jwt =
    encode64(utf8(JSON.stringify({ typ: "JWT", alg: "ES256" }))) +
    "." +
    encode64(
      utf8(
        JSON.stringify({
          aud: new URL(subscription.endpoint).origin,
          exp: Math.floor(Date.now() / 1000) + 3600,
          sub: "https://wamarket.xrkr80hd.studio",
        }),
      ),
    );
  const signature = await crypto.subtle.sign(
    { name: "ECDSA", hash: "SHA-256" },
    signingKey,
    utf8(jwt),
  );
  const response = await fetcher(subscription.endpoint, {
    method: "POST",
    redirect: "error",
    signal: AbortSignal.timeout(8000),
    headers: {
      Authorization: `vapid t=${jwt}.${encode64(signature)}, k=${vapid.publicKey}`,
      TTL: "86400",
      Urgency: "normal",
      "Content-Encoding": "aes128gcm",
      "Content-Type": "application/octet-stream",
    },
    body: await encryptPush(subscription, payload),
  });
  return response.status;
}
