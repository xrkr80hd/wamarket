import { useRef, useState } from "react";
import { addAsset } from "../lib/preview-store";
import LocationBadge from "./location-badge";

export default function FolderImagePicker({
  value = "",
  onChange,
  onBusyChange,
  folder,
}: any) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  return (
    <div className="folder-image-picker">
      <div className="folder-image-preview">
        <LocationBadge record={{ ...folder, kind: "folder", artwork: value }} />
      </div>
      <div>
        <b>Folder graphic / icon</b>
        <p>Upload an image to display on this folder.</p>
        <input
          ref={input}
          type="file"
          accept="image/*"
          hidden
          aria-label="Upload folder graphic"
          disabled={busy}
          onChange={async (event) => {
            const file = event.target.files?.[0];
            event.target.value = "";
            if (!file) return;
            if (!file.type.startsWith("image/")) {
              setError("Choose an image file for the folder graphic.");
              return;
            }
            setBusy(true);
            onBusyChange?.(true);
            setError("");
            try {
              const id = await addAsset(file, {
                folder: folder?.id || "",
                dealership: folder?.dealership || "",
                folderArtwork: true,
              });
              onChange(id);
            } catch (e: any) {
              setError(
                e.message || "Could not upload the folder graphic. Try again.",
              );
            } finally {
              setBusy(false);
              onBusyChange?.(false);
            }
          }}
        />
        <div className="ops-actions">
          <button
            type="button"
            disabled={busy}
            onClick={() => input.current?.click()}
          >
            {busy
              ? "Uploading…"
              : value
                ? "Replace graphic"
                : "Upload graphic / icon"}
          </button>
          {value && (
            <button
              type="button"
              disabled={busy}
              onClick={() => {
                onChange("");
                setError("");
              }}
            >
              Use default icon
            </button>
          )}
        </div>
        {error && (
          <p className="notice" role="alert">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
