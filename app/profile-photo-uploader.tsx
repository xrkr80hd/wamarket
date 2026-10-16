"use client";
import { apiFetch, apiJSON } from "../lib/api-response";
import { useEffect, useRef, useState } from "react";
import { Dialog } from "radix-ui";
import Cropper from "react-easy-crop";
import { Camera, Upload, X, RotateCcw } from "lucide-react";
import { croppedAvatar, type CropPixels } from "../lib/profile-crop";
export default function ProfilePhotoUploader({
  member,
  version,
  onSaved,
  accent = "#cd315e",
  theme = "light",
}: any) {
  const chooser = useRef<HTMLInputElement>(null);
  const [source, setSource] = useState(""),
    [crop, setCrop] = useState({ x: 0, y: 0 }),
    [zoom, setZoom] = useState(1),
    [rotation, setRotation] = useState(0),
    [pixels, setPixels] = useState<CropPixels | null>(null),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [preview, setPreview] = useState("");
  useEffect(
    () => () => {
      if (source) URL.revokeObjectURL(source);
    },
    [source],
  );
  useEffect(() => {
    if (!source || !pixels) return;
    let disposed = false;
    let generated = "";
    croppedAvatar(source, pixels, rotation)
      .then((blob) => {
        generated = URL.createObjectURL(blob);
        if (!disposed) setPreview(generated);
        else URL.revokeObjectURL(generated);
      })
      .catch(() => {});
    return () => {
      disposed = true;
      if (generated) URL.revokeObjectURL(generated);
    };
  }, [source, pixels, rotation]);
  function close() {
    if (busy) return;
    setSource("");
    setPixels(null);
    setPreview("");
    setError("");
  }
  function choose() {
    setError("");
    chooser.current?.click();
  }
  async function selected(file: File | undefined) {
    if (!file) return;
    if (
      !["image/jpeg", "image/png", "image/webp", "image/gif"].includes(
        file.type,
      ) ||
      file.size > 5 * 1024 * 1024
    ) {
      setError("Choose a JPG, PNG, WEBP or GIF up to 5 MB.");
      return;
    }
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
    setPixels(null);
    setPreview("");
    setSource(URL.createObjectURL(file));
    setError("");
  }
  async function save() {
    if (!pixels) return;
    setBusy(true);
    setError("");
    try {
      const blob = await croppedAvatar(source, pixels, rotation);
      const data = new FormData();
      data.append(
        "file",
        new File([blob], "profile-photo.png", { type: "image/png" }),
      );
      const r = await apiFetch("/api/profile-photo", {
        method: "POST",
        body: data,
      });
      const d: any = await apiJSON(r);
      if (!r.ok) throw Error(d.error || "Unable to save photo");
      await onSaved();
      setSource("");
      setPixels(null);
      setPreview("");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  const h = /^#[0-9a-f]{6}$/i.test(accent) ? accent : "#cd315e";
  const rgb = [1, 3, 5]
    .map((i) => parseInt(h.slice(i, i + 2), 16) / 255)
    .map((v) =>
      v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4),
    );
  const lum = rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
  const contrast = lum > 0.179 ? "#111827" : "#ffffff";
  return (
    <div
      className="profile-upload"
      style={{ "--accent": h, "--accent-contrast": contrast } as any}
    >
      <input
        ref={chooser}
        className="hidden-file-input"
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        aria-label="Choose your profile photo"
        onChange={(e) => {
          selected(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
      <div className="profile-pick-row">
        <button
          className="profile-photo-preview profile-photo-choose"
          type="button"
          onClick={choose}
          aria-label="Choose or change your profile photo"
          title="Choose profile photo"
        >
          {member?.avatar_key ? (
            <img
              src={"/api/profile-photo?id=" + member.id + "&v=" + version}
              alt="Your profile photo"
            />
          ) : (
            <span>{member?.role === "owner" ? "MH" : "TW"}</span>
          )}
          <span className="photo-camera">
            <Camera size={15} />
          </span>
        </button>
        <div>
          <button
            className="photo-choose-button"
            type="button"
            onClick={choose}
          >
            <Upload size={15} /> Choose
          </button>
          <p>Or click the circle to choose a photo.</p>
        </div>
      </div>
      <p className="photo-help">
        JPG, PNG, WEBP or GIF · up to 5 MB. Your photo saves only to your
        account.
      </p>
      {error && !source && (
        <p role="alert" className="crop-error">
          {error}
        </p>
      )}
      <Dialog.Root
        open={!!source}
        onOpenChange={(open) => {
          if (!open) close();
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="crop-overlay" />
          <Dialog.Content
            className={"crop-dialog " + (theme === "dark" ? "crop-dark" : "")}
            style={{ "--accent": h, "--accent-contrast": contrast } as any}
            onEscapeKeyDown={(e) => {
              if (busy) e.preventDefault();
            }}
            onPointerDownOutside={(e) => {
              if (busy) e.preventDefault();
            }}
          >
            <div className="crop-heading">
              <div>
                <Dialog.Title className="crop-title">
                  Crop your profile photo
                </Dialog.Title>
                <Dialog.Description className="crop-description">
                  Drag to reposition. Zoom to fit your face inside the circle.
                </Dialog.Description>
              </div>
              <Dialog.Close asChild>
                <button
                  className="icon"
                  aria-label="Close crop dialog"
                  disabled={busy}
                >
                  <X size={20} />
                </button>
              </Dialog.Close>
            </div>
            <div className="crop-stage">
              <Cropper
                image={source}
                crop={crop}
                zoom={zoom}
                rotation={rotation}
                aspect={1}
                cropShape="round"
                showGrid={false}
                restrictPosition={true}
                minZoom={1}
                maxZoom={4}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(_, area) => setPixels(area)}
                keyboardStep={10}
                mediaProps={{
                  alt: "Your selected photo",
                  onError: () =>
                    setError(
                      "This photo could not be opened. Choose another file.",
                    ),
                }}
              />
            </div>
            <div className="crop-tools">
              <div className="crop-sliders">
                <label htmlFor="avatar-zoom">
                  Zoom <span>{zoom.toFixed(1)}×</span>
                </label>
                <input
                  id="avatar-zoom"
                  type="range"
                  min="1"
                  max="4"
                  step="0.01"
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                />
                <label htmlFor="avatar-rotation">
                  Rotate <span>{rotation}°</span>
                </label>
                <input
                  id="avatar-rotation"
                  type="range"
                  min="-180"
                  max="180"
                  step="1"
                  value={rotation}
                  onChange={(e) => setRotation(Number(e.target.value))}
                />
              </div>
              <div className="crop-preview-box">
                <span>Preview</span>
                {preview ? (
                  <img src={preview} alt="Cropped profile preview" />
                ) : (
                  <div className="crop-preview-placeholder" />
                )}
              </div>
            </div>
            {error && (
              <p role="alert" className="crop-error">
                {error}
              </p>
            )}
            <div className="crop-actions">
              <button
                onClick={() => {
                  setCrop({ x: 0, y: 0 });
                  setZoom(1);
                  setRotation(0);
                }}
                disabled={busy}
              >
                <RotateCcw size={15} /> Reset
              </button>
              <button onClick={choose} disabled={busy}>
                Choose another
              </button>
              <button
                className="photo-choose-button"
                onClick={save}
                disabled={busy || !pixels}
              >
                {busy ? "Saving…" : "Save photo"}
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
