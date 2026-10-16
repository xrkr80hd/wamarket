"use client";
import { useState, useEffect } from "react";
import { Dialog } from "radix-ui";
import {
  Palette,
  X,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
} from "lucide-react";
import { seasonForDate, heroFilter } from "../lib/hero-season";
export default function HeroArtwork({ date, preferences, onSave }: any) {
  const [show, setShow] = useState(false),
    [mode, setMode] = useState(preferences?.heroTheme?.mode || "auto"),
    [hue, setHue] = useState(preferences?.heroTheme?.hue ?? 335),
    [busy, setBusy] = useState(false);
  const [slide, setSlide] = useState(0),
    [paused, setPaused] = useState(false);
  const images = Array.isArray(preferences?.heroImages)
    ? preferences.heroImages
    : [];
  useEffect(() => {
    if (
      images.length < 2 ||
      paused ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const timer = setInterval(() => {
      if (document.visibilityState === "visible")
        setSlide((n) => (n + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length, paused]);
  const seasonal = seasonForDate(date || "2026-10-01");
  const saved = preferences?.heroTheme;
  const applied = show ? { mode, hue } : saved || { mode: "auto", hue: 335 };
  const theme =
    applied.mode === "manual"
      ? {
          name: "Custom hue",
          hue: applied.hue,
          saturation: 1,
          brightness: 1,
          contrast: 1,
          background: `hsl(${applied.hue},55%,26%)`,
        }
      : seasonal;
  function pick(e: any) {
    const rect = e.currentTarget.getBoundingClientRect();
    const angle =
      ((Math.atan2(
        e.clientX - rect.left - rect.width / 2,
        -(e.clientY - rect.top - rect.height / 2),
      ) *
        180) /
        Math.PI +
        360) %
      360;
    setHue(Math.round(angle));
    setMode("manual");
  }
  return images.length ? (
    <div
      className="hero-art supplied personal-hero-carousel"
      aria-label="Your personal hero photos"
    >
      <img
        key={images[slide % images.length]}
        src={"/api/hero-images?image=" + images[slide % images.length]}
        alt={"Personal hero photo " + ((slide % images.length) + 1)}
      />
      {images.length > 1 && (
        <div className="hero-carousel-controls">
          <button
            aria-label="Previous photo"
            onClick={() =>
              setSlide((n) => (n + images.length - 1) % images.length)
            }
          >
            <ChevronLeft size={17} />
          </button>
          <span>
            {(slide % images.length) + 1} / {images.length}
          </span>
          <button
            aria-label={paused ? "Play carousel" : "Pause carousel"}
            onClick={() => setPaused(!paused)}
          >
            {paused ? <Play size={15} /> : <Pause size={15} />}
          </button>
          <button
            aria-label="Next photo"
            onClick={() => setSlide((n) => (n + 1) % images.length)}
          >
            <ChevronRight size={17} />
          </button>
        </div>
      )}
    </div>
  ) : (
    <div className="hero-art supplied" style={{ background: theme.background }}>
      <img
        src="/walker-hero.jpg"
        alt={"Walker 100 — " + theme.name}
        style={{
          filter: heroFilter(theme),
          transition: "filter 1.2s ease, background 1.2s ease",
        }}
      />
      <button
        className="hero-palette-button"
        aria-label="Seasonal graphic color settings"
        title="Seasonal graphic color"
        onClick={() => {
          setMode(saved?.mode || "auto");
          setHue(saved?.hue ?? 335);
          setShow(!show);
        }}
      >
        <Palette size={17} />
      </button>
      {show && (
        <Dialog.Root open={show} onOpenChange={setShow}>
          <Dialog.Portal container={document.querySelector(".workspace-shell")}>
            <Dialog.Overlay className="hero-settings-overlay" />
            <Dialog.Content
              className="hero-color-panel hero-settings-dialog"
              aria-describedby={undefined}
            >
              <div className="hero-color-header">
                <Dialog.Title>Graphic color</Dialog.Title>
                <button
                  onClick={() => setShow(false)}
                  aria-label="Close graphic color settings"
                >
                  <X size={15} />
                </button>
              </div>
              <div className="hero-color-modes">
                <button
                  className={mode === "auto" ? "chosen" : ""}
                  onClick={() => setMode("auto")}
                >
                  Seasonal auto
                </button>
                <button
                  className={mode === "manual" ? "chosen" : ""}
                  onClick={() => setMode("manual")}
                >
                  Custom hue
                </button>
              </div>
              <p>
                {mode === "auto"
                  ? seasonal.name + " · changes with the calendar"
                  : "Drag the wheel to choose a hue."}
              </p>
              <div
                className="hue-wheel"
                role="slider"
                tabIndex={0}
                aria-label="Graphic hue wheel"
                aria-valuemin={0}
                aria-valuemax={359}
                aria-valuenow={hue}
                onPointerDown={(e) => {
                  e.currentTarget.setPointerCapture(e.pointerId);
                  pick(e);
                }}
                onPointerMove={(e) => {
                  if (e.buttons === 1) pick(e);
                }}
                onKeyDown={(e) => {
                  if (
                    [
                      "ArrowRight",
                      "ArrowUp",
                      "ArrowLeft",
                      "ArrowDown",
                    ].includes(e.key)
                  ) {
                    e.preventDefault();
                    setHue(
                      (hue +
                        (["ArrowRight", "ArrowUp"].includes(e.key) ? 5 : 355)) %
                        360,
                    );
                    setMode("manual");
                  }
                }}
              >
                <span className="hue-wheel-center" />
                <span
                  className="hue-wheel-marker"
                  style={{ transform: `rotate(${hue}deg) translateY(-47px)` }}
                />
              </div>
              <label>
                Hue
                <input
                  type="range"
                  min="0"
                  max="359"
                  value={hue}
                  onChange={(e) => {
                    setHue(Number(e.target.value));
                    setMode("manual");
                  }}
                />
              </label>
              <button
                className="hero-color-save"
                disabled={busy}
                onClick={async () => {
                  setBusy(true);
                  try {
                    if (
                      await onSave({ ...preferences, heroTheme: { mode, hue } })
                    )
                      setShow(false);
                  } finally {
                    setBusy(false);
                  }
                }}
              >
                Save my color setting
              </button>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      )}
    </div>
  );
}
