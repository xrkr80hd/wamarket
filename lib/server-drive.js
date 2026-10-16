import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  createHash,
} from "node:crypto";
export const SITE = "https://wamark.finishmylaunch.com";
export const CALLBACK = SITE + "/api/drive?route=callback";
const MASTER = "xrkr80hd@gmail.com";
const key = () => {
  const secret = process.env.DRIVE_BRIDGE_SECRET;
  if (!secret || secret.length < 32)
    throw Error("Drive connection encryption is not configured.");
  return createHash("sha256").update(secret).digest();
};
export function seal(data) {
  const iv = randomBytes(12),
    cipher = createCipheriv("aes-256-gcm", key(), iv);
  const encrypted = Buffer.concat([
    cipher.update(JSON.stringify(data)),
    cipher.final(),
  ]);
  return Buffer.concat([iv, cipher.getAuthTag(), encrypted]).toString(
    "base64url",
  );
}
export function unseal(value) {
  const b = Buffer.from(value, "base64url"),
    decipher = createDecipheriv("aes-256-gcm", key(), b.subarray(0, 12));
  decipher.setAuthTag(b.subarray(12, 28));
  return JSON.parse(
    Buffer.concat([
      decipher.update(b.subarray(28)),
      decipher.final(),
    ]).toString(),
  );
}
export function sessionToken(req) {
  const v = (req.headers.cookie || "")
    .split(";")
    .map((x) => x.trim())
    .find((x) => x.startsWith("wam_cloud_session="))
    ?.slice(18);
  return v ? decodeURIComponent(v) : "";
}
export async function me(token) {
  const r = await fetch(process.env.SUPABASE_URL + "/auth/v1/user", {
    headers: {
      apikey: process.env.SUPABASE_PUBLISHABLE_KEY,
      Authorization: "Bearer " + token,
    },
  });
  const u = await r.json();
  if (
    !r.ok ||
    !u.email_confirmed_at ||
    u.app_metadata?.wamarket_active === false ||
    !(u.email?.toLowerCase() === MASTER || u.app_metadata?.wamarket_access)
  )
    throw Object.assign(Error("Sign in to continue."), { status: 401 });
  return u;
}
export async function edge(token, route, body) {
  const r = await fetch(
    process.env.SUPABASE_URL +
      "/functions/v1/wamarket-workspace?route=" +
      route,
    {
      method: body ? "POST" : "GET",
      headers: {
        apikey: process.env.SUPABASE_PUBLISHABLE_KEY,
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
        "X-Drive-Bridge": process.env.DRIVE_BRIDGE_SECRET || "",
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    },
  );
  const d = await r.json();
  if (!r.ok)
    throw Object.assign(Error(d.error || "Storage service unavailable"), {
      status: r.status,
    });
  return d;
}
export async function driveConfig(token) {
  const d = await edge(token, "drive-config");
  return d.data?.encrypted ? unseal(d.data.encrypted) : null;
}
export async function saveDriveConfig(token, config) {
  return edge(token, "drive-config", { encrypted: seal(config) });
}
export async function googleToken(config) {
  if (!config?.refreshToken)
    throw Error("Connect Google Drive before uploading.");
  const r = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      refresh_token: config.refreshToken,
      grant_type: "refresh_token",
    }),
  });
  const d = await r.json();
  if (!r.ok)
    throw Error(
      "Google Drive authorization expired. Reconnect Drive in Team & Settings.",
    );
  return d.access_token;
}
export async function driveUpload(token, body) {
  const u = await me(token);
  if (u.app_metadata?.wamarket_role === "viewer")
    throw Object.assign(Error("Viewer accounts cannot upload media."), {
      status: 403,
    });
  const config = await driveConfig(token);
  if (!config?.refreshToken) return null;
  if (!/^(image|video|audio)\//.test(body.type || ""))
    throw Error("Choose a video, image, or audio file.");
  const access = await googleToken(config),
    id = crypto.randomUUID();
  const r = await fetch(
    "https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable&fields=id,name,mimeType",
    {
      method: "POST",
      headers: {
        Authorization: "Bearer " + access,
        "Content-Type": "application/json",
        "X-Upload-Content-Type": body.type,
        "X-Upload-Content-Length": String(body.size),
      },
      body: JSON.stringify({
        name: body.name,
        parents: [config.folderId],
        mimeType: body.type,
        appProperties: { wamarketAssetId: id, wamarketUserId: u.id },
      }),
    },
  );
  if (!r.ok)
    throw Error(
      "Google Drive could not start this upload. Check the connected folder permissions.",
    );
  return {
    provider: "gdrive",
    id,
    uploadURL: r.headers.get("location"),
    folderId: config.folderId,
  };
}
export async function verifyDriveAsset(token, record) {
  const config = await driveConfig(token),
    access = await googleToken(config);
  const r = await fetch(
    "https://www.googleapis.com/drive/v3/files/" +
      encodeURIComponent(record.storage.fileId) +
      "?fields=id,parents,appProperties,trashed",
    { headers: { Authorization: "Bearer " + access } },
  );
  const f = await r.json();
  if (
    !r.ok ||
    f.trashed ||
    !f.parents?.includes(config.folderId) ||
    f.appProperties?.wamarketAssetId !== record.id
  )
    throw Object.assign(
      Error("This file is outside the connected workspace folder."),
      { status: 403 },
    );
}
