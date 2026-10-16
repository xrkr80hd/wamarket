import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import {
  incomingSoundTracker,
  playChatSound,
  resetChatSound,
  saveSoundPreferences,
  soundPreferences,
  unlockChatAudio,
  uploadChatSound,
} from "../lib/chat-sound";
export function useChatSound(state: any, id: string) {
  const tracker = useRef(incomingSoundTracker());
  useEffect(() => {
    document.addEventListener("pointerdown", unlockChatAudio);
    document.addEventListener("keydown", unlockChatAudio);
    return () => {
      document.removeEventListener("pointerdown", unlockChatAudio);
      document.removeEventListener("keydown", unlockChatAudio);
    };
  }, []);
  useEffect(() => {
    const message = tracker.current(state, id);
    if (!message) return;
    try {
      const key = `wam-chat-last-sound:${id}`;
      if (localStorage.getItem(key) === message.id) return;
      localStorage.setItem(key, message.id);
      void playChatSound(id).catch(() => {});
    } catch {
      /* Notifications must never interrupt chat. */
    }
  }, [state.messages, state.conversations, id]);
}
export function ChatSoundControls({ id }: { id: string }) {
  const [prefs, setPrefs] = useState(() => soundPreferences(id));
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const menu = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const update = () => setPrefs(soundPreferences(id));
    window.addEventListener("storage", update);
    const close = (event: PointerEvent) => {
      if (!menu.current?.contains(event.target as Node))
        menu.current?.removeAttribute("open");
    };
    document.addEventListener("pointerdown", close);
    return () => {
      window.removeEventListener("storage", update);
      document.removeEventListener("pointerdown", close);
    };
  }, [id]);
  async function change(action: () => Promise<void>) {
    setBusy(true);
    setError("");
    unlockChatAudio();
    try {
      await action();
      setPrefs(soundPreferences(id));
    } catch (e: any) {
      setError(e.message || "Unable to save sound.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <details
      className="chat-sound"
      ref={menu}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          menu.current?.removeAttribute("open");
          menu.current?.querySelector("summary")?.focus();
        }
      }}
    >
      <summary
        aria-label="Chat notification sound"
        title="Chat notification sound"
      >
        {prefs.muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
      </summary>
      <div className="chat-sound-panel">
        <b>Message sound</b>
        <label>
          <input
            type="checkbox"
            checked={!prefs.muted}
            onChange={(event) => {
              const next = { ...prefs, muted: !event.target.checked };
              try {
                saveSoundPreferences(id, next);
                setPrefs(next);
                unlockChatAudio();
                setError("");
              } catch {
                setError("Unable to save sound preferences.");
              }
            }}
          />{" "}
          Play incoming message sounds
        </label>
        <small>{prefs.filename || "Default soft chime"}</small>
        <div className="chat-sound-actions">
          <button
            type="button"
            disabled={busy}
            onClick={() => change(() => playChatSound(id, true))}
          >
            Preview
          </button>
          {prefs.filename && (
            <button
              type="button"
              disabled={busy}
              onClick={() => change(() => resetChatSound(id))}
            >
              Use default
            </button>
          )}
        </div>
        <label>
          Upload your own sound
          <input
            type="file"
            accept="audio/*,.mp3,.wav,.m4a,.ogg"
            disabled={busy}
            onChange={(event) => {
              const file = event.target.files?.[0];
              event.target.value = "";
              if (file)
                void change(async () => {
                  await uploadChatSound(id, file);
                  await playChatSound(id, true);
                });
            }}
          />
        </label>
        <small>
          Up to 2 MB · plays the first 3 seconds.
          <br />
          Saved for your account on this browser.
        </small>
        {busy && <small role="status">Working…</small>}
        {error && <p role="alert">{error}</p>}
      </div>
    </details>
  );
}
