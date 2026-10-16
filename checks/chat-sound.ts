import "fake-indexeddb/auto";
import assert from "node:assert/strict";
import { incomingSoundTracker, playChatSound, resetChatSound, saveSoundPreferences, soundPreferences, unlockChatAudio, uploadChatSound } from "../lib/chat-sound";
const values = new Map<string, string>();
Object.assign(globalThis, { localStorage: { getItem: (key: string) => values.get(key) || null, setItem: (key: string, value: string) => values.set(key, value) } });
let notes = 0, clips = 0;
const gain = () => ({ gain: { setValueAtTime() {}, linearRampToValueAtTime() {}, exponentialRampToValueAtTime() {} }, connect() { return this; }, disconnect() {} });
class TestAudio {
  state = "running"; currentTime = 0; destination = {};
  async resume() {}
  async decodeAudioData(bytes: ArrayBuffer) { if (new Uint8Array(bytes)[0] === 0) throw Error("bad audio"); return { duration: 1 }; }
  createGain = gain;
  createOscillator() { return { frequency: { value: 0 }, connect() { return gain(); }, disconnect() {}, start() { notes++; }, stop() {} }; }
  createBufferSource() { return { connect() { return gain(); }, disconnect() {}, start() { clips++; } }; }
}
Object.assign(globalThis, { AudioContext: TestAudio });
const message = (id: string, sender = "other", conversationId = "team") => ({ id, sender_id: sender, conversationId, created_at: "2026-10-16T12:00:00Z" });
const state: any = { messages: [message("old")], conversations: [{ id: "team", members: ["me", "other"] }], read: {} };
const track = incomingSoundTracker();
assert.equal(track(state, "me"), null);
state.messages.push(message("new")); assert.equal(track(state, "me").id, "new");
assert.equal(track(state, "me"), null);
state.messages[1].text = "edited"; assert.equal(track(state, "me"), null);
state.messages.push(message("mine", "me"), message("private", "other", "private"), { ...message("archived"), archived: true });
assert.equal(track(state, "me"), null);
state.read.meteam = "2026-10-17"; state.messages.push(message("already-read")); assert.equal(track(state, "me"), null);
assert.equal(track(state, "other"), null);
console.log("PASS Initial history, edits, own messages, archived messages and inaccessible chats stay silent");
unlockChatAudio();
await playChatSound("me"); assert.equal(notes, 2);
saveSoundPreferences("me", { muted: true, filename: "" }); await playChatSound("me"); assert.equal(notes, 2);
await playChatSound("me", true); assert.equal(notes, 4);
console.log("PASS Default chime, mute and explicit preview");
await assert.rejects(uploadChatSound("me", new File(["text"], "notes.txt", { type: "text/plain" })), /audio file/);
await assert.rejects(uploadChatSound("me", new File([new Uint8Array(2 * 1024 * 1024 + 1)], "large.mp3", { type: "audio/mpeg" })), /2 MB/);
await assert.rejects(uploadChatSound("me", new File([new Uint8Array([0])], "broken.mp3", { type: "audio/mpeg" })), /cannot play/);
await uploadChatSound("me", new File([new Uint8Array([1])], "custom.mp3", { type: "audio/mpeg" }));
assert.equal(soundPreferences("me").filename, "custom.mp3");
assert.equal(soundPreferences("other").filename, "");
await playChatSound("me"); assert.equal(clips, 1);
await resetChatSound("me"); assert.equal(soundPreferences("me").filename, "");
await playChatSound("me"); assert.equal(notes, 6);
console.log("PASS Upload validation, saved custom playback, account isolation and reset to default");
