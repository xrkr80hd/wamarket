export type SoundPreferences = { muted: boolean; filename: string };
const key = (id: string) => `wam-chat-sound:${id}`;
export function soundPreferences(id: string): SoundPreferences {
  try {
    const value = JSON.parse(localStorage.getItem(key(id)) || "{}");
    return {
      muted: value.muted === true,
      filename: String(value.filename || ""),
    };
  } catch {
    return { muted: false, filename: "" };
  }
}
export function saveSoundPreferences(id: string, value: SoundPreferences) {
  localStorage.setItem(key(id), JSON.stringify(value));
}
async function audioStore(
  mode: IDBTransactionMode,
  id: string,
  value?: Blob | null,
): Promise<Blob | undefined> {
  const db = await new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open("wam-notification-sounds", 1);
    request.onupgradeneeded = () => request.result.createObjectStore("sounds");
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
  try {
    return await new Promise((resolve, reject) => {
      const transaction = db.transaction("sounds", mode);
      const store = transaction.objectStore("sounds");
      const request =
        mode === "readonly"
          ? store.get(id)
          : value
            ? store.put(value, id)
            : store.delete(id);
      transaction.oncomplete = () =>
        resolve(mode === "readonly" ? request.result : undefined);
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () =>
        reject(transaction.error || Error("Unable to save sound"));
    });
  } finally {
    db.close();
  }
}
let context: AudioContext | undefined;
function audioContext() {
  context ||= new AudioContext();
  return context;
}
export function unlockChatAudio() {
  try {
    void audioContext()
      .resume()
      .catch(() => {});
  } catch {
    /* Browser has no audio support. */
  }
}
export async function uploadChatSound(id: string, file: File) {
  if (
    !file.type.startsWith("audio/") &&
    !/\.(mp3|wav|m4a|ogg|aac|webm)$/i.test(file.name)
  )
    throw Error("Choose an audio file such as MP3, WAV or M4A.");
  if (!file.size || file.size > 2 * 1024 * 1024)
    throw Error("Choose a sound smaller than 2 MB.");
  try {
    await audioContext().decodeAudioData(await file.arrayBuffer());
  } catch {
    throw Error("This browser cannot play that file. Try MP3 or WAV.");
  }
  await audioStore("readwrite", id, file);
  saveSoundPreferences(id, { muted: false, filename: file.name });
}
export async function resetChatSound(id: string) {
  await audioStore("readwrite", id, null);
  saveSoundPreferences(id, { ...soundPreferences(id), filename: "" });
}
export async function playChatSound(id: string, preview = false) {
  const prefs = soundPreferences(id);
  if (prefs.muted && !preview) return;
  const audio = audioContext();
  if (audio.state !== "running") return; // Wait for a user gesture; never replay a backlog.
  if (prefs.filename) {
    try {
      const file = await audioStore("readonly", id);
      if (file) {
        const buffer = await audio.decodeAudioData(await file.arrayBuffer());
        if (!preview && soundPreferences(id).muted) return;
        const source = audio.createBufferSource(),
          gain = audio.createGain();
        source.buffer = buffer;
        gain.gain.setValueAtTime(0.45, audio.currentTime);
        const length = Math.min(3, buffer.duration);
        gain.gain.setValueAtTime(
          0.45,
          audio.currentTime + Math.max(0, length - 0.08),
        );
        gain.gain.linearRampToValueAtTime(0, audio.currentTime + length);
        source.connect(gain).connect(audio.destination);
        source.onended = () => {
          source.disconnect();
          gain.disconnect();
        };
        source.start(0, 0, length);
        return;
      }
    } catch {
      /* A missing device-local upload falls back to the chime. */
    }
  }
  [660, 880].forEach((frequency, index) => {
    const start = audio.currentTime + index * 0.11;
    const oscillator = audio.createOscillator(),
      gain = audio.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(0.12, start + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.28);
    oscillator.connect(gain).connect(audio.destination);
    oscillator.onended = () => {
      oscillator.disconnect();
      gain.disconnect();
    };
    oscillator.start(start);
    oscillator.stop(start + 0.3);
  });
}
// Seed with existing IDs so signing in or editing an old message never chimes.
export function incomingSoundTracker() {
  let identity = "",
    seen = new Set<string>();
  return (state: any, id: string) => {
    const messages = state.messages || [];
    if (identity !== id) {
      identity = id;
      seen = new Set(messages.map((m: any) => m.id));
      return null;
    }
    let incoming: any = null;
    for (const message of messages) {
      if (
        !seen.has(message.id) &&
        !message.archived &&
        message.sender_id !== id &&
        state.conversations.some(
          (c: any) => c.id === message.conversationId && c.members.includes(id),
        ) &&
        message.created_at > (state.read[id + message.conversationId] || "")
      )
        incoming = message;
      seen.add(message.id);
    }
    return incoming;
  };
}
