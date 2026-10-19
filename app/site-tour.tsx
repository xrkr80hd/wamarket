import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CircleHelp, X } from "lucide-react";
import { guideSteps } from "../lib/site-guide";
import "./site-tour.css";

type Props = {
  onNavigate: (page: string) => void;
  userId?: string;
  userName?: string;
};
export default function SiteTour({ onNavigate, userId, userName }: Props) {
  const [step, setStep] = useState<number | null>(null);
  const [spot, setSpot] = useState<DOMRect | null>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLDivElement>(null);
  const checkedUser = useRef<string | undefined>(undefined);
  const open = step !== null;
  const current = step === null ? null : guideSteps[step];
  const close = () => {
    setStep(null);
    requestAnimationFrame(() => trigger.current?.focus());
  };
  function visit(index: number) {
    const next = guideSteps[index];
    if (next.page) onNavigate(next.page);
    setStep(index);
  }

  useEffect(() => {
    if (!userId || checkedUser.current === userId) return;
    checkedUser.current = userId;
    setStep(null);
    // Mark the first showing immediately, so quitting or reloading never nags.
    // If storage is unavailable, keep the tour available through the button.
    try {
      const key = `wam-site-tour-seen:${userId}`;
      if (localStorage.getItem(key)) return;
      localStorage.setItem(key, "true");
    } catch {
      return;
    }
    onNavigate("Overview");
    setStep(0);
  }, [userId, onNavigate]);

  useEffect(() => {
    if (!open) return;
    const root = document.getElementById("root");
    const previousInert = root?.inert;
    if (root) root.inert = true;
    return () => {
      if (root) root.inert = previousInert ?? false;
    };
  }, [open]);

  useEffect(() => {
    if (!current) return;
    dialog.current?.focus();
    let target = document.querySelector<HTMLElement>(
      `[data-tour="${current.target}"]`,
    );
    if (
      current.target === "navigation" &&
      target &&
      target.getBoundingClientRect().right <= 0
    )
      target = document.querySelector<HTMLElement>(".navigation-toggle");
    if (current.target === "page")
      target?.scrollIntoView({ block: "start", behavior: "instant" });
    const update = () => {
      const rect = target?.getBoundingClientRect();
      setSpot(
        rect && rect.width && rect.height && rect.bottom > 0 ? rect : null,
      );
    };
    update();
    const observer = new ResizeObserver(update);
    if (target) observer.observe(target);
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [current]);

  return (
    <>
      <button
        ref={trigger}
        type="button"
        className="icon wam-tour-trigger"
        aria-label="Start site tour"
        title="Site tour — a step-by-step guide to WAM"
        onClick={() => visit(0)}
      >
        <CircleHelp size={18} />
        <span>Site tour</span>
      </button>
      <HoverHelp disabled={step !== null} />
      {current &&
        createPortal(
          <div className="wam-tour-layer">
            {!spot && <div className="wam-tour-shade" />}
            {spot && (
              <div
                className="wam-tour-spot"
                aria-hidden="true"
                style={{
                  top: Math.max(4, spot.top - 5),
                  left: Math.max(4, spot.left - 5),
                  width: Math.min(spot.width + 10, window.innerWidth - 8),
                  height: Math.min(
                    spot.height + 10,
                    window.innerHeight - Math.max(4, spot.top - 5) - 4,
                  ),
                }}
              />
            )}
            <div
              className="wam-tour-dialog"
              ref={dialog}
              role="dialog"
              aria-modal="true"
              aria-labelledby="wam-tour-title"
              aria-describedby="wam-tour-copy"
              tabIndex={-1}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  event.preventDefault();
                  close();
                }
                if (event.key === "Tab") {
                  const controls =
                    dialog.current?.querySelectorAll<HTMLElement>(
                      "button:not(:disabled), select",
                    );
                  const first = controls?.[0],
                    last = controls?.[controls.length - 1];
                  if (
                    event.shiftKey &&
                    (document.activeElement === first ||
                      document.activeElement === dialog.current)
                  ) {
                    event.preventDefault();
                    last?.focus();
                  } else if (
                    !event.shiftKey &&
                    document.activeElement === last
                  ) {
                    event.preventDefault();
                    first?.focus();
                  }
                }
              }}
            >
              <div className="wam-tour-top">
                <span>WAM · QUICK WALKTHROUGH</span>
                <button
                  type="button"
                  aria-label="Quit tutorial"
                  onClick={close}
                >
                  <X size={19} />
                  Quit tutorial
                </button>
              </div>
              <div aria-live="polite" aria-atomic="true">
                <small>
                  Step {step! + 1} of {guideSteps.length}
                </small>
                <h2 id="wam-tour-title">{current.title}</h2>
                <p id="wam-tour-copy">
                  {current.summary.replace(
                    "{name}",
                    userName?.trim().split(/\s+/)[0] || "Welcome",
                  )}
                </p>
                <div className="wam-tour-action">{current.action}</div>
              </div>
              <label className="wam-tour-jump">
                Jump to a section
                <select
                  value={step!}
                  onChange={(event) => visit(Number(event.target.value))}
                >
                  {guideSteps.map((item, index) => (
                    <option key={index} value={index}>
                      {index + 1}. {item.title}
                    </option>
                  ))}
                </select>
              </label>
              <div className="wam-tour-footer">
                <button
                  type="button"
                  disabled={step === 0}
                  onClick={() => visit(step! - 1)}
                >
                  Back
                </button>
                <button
                  type="button"
                  className="wam-tour-next"
                  onClick={() =>
                    step === guideSteps.length - 1 ? close() : visit(step! + 1)
                  }
                >
                  {step === guideSteps.length - 1 ? "Finish tour" : "Next"}
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}

function HoverHelp({ disabled }: { disabled: boolean }) {
  const [tip, setTip] = useState<{ text: string; rect: DOMRect } | null>(null);
  useEffect(() => {
    if (disabled) {
      setTip(null);
      return;
    }
    let timer: ReturnType<typeof setTimeout>;
    const hide = () => {
      clearTimeout(timer);
      setTip(null);
    };
    const show = (event: Event) => {
      hide();
      const target =
        event.target instanceof Element
          ? event.target.closest<HTMLElement>("[data-help]")
          : null;
      if (!target?.dataset.help) return;
      timer = setTimeout(
        () =>
          setTip({
            text: target.dataset.help!,
            rect: target.getBoundingClientRect(),
          }),
        400,
      );
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") hide();
    };
    document.addEventListener("pointerover", show);
    document.addEventListener("focusin", show);
    document.addEventListener("pointerout", hide);
    document.addEventListener("focusout", hide);
    document.addEventListener("pointerdown", hide);
    document.addEventListener("keydown", escape);
    window.addEventListener("scroll", hide, true);
    window.addEventListener("resize", hide);
    return () => {
      hide();
      document.removeEventListener("pointerover", show);
      document.removeEventListener("focusin", show);
      document.removeEventListener("pointerout", hide);
      document.removeEventListener("focusout", hide);
      document.removeEventListener("pointerdown", hide);
      document.removeEventListener("keydown", escape);
      window.removeEventListener("scroll", hide, true);
      window.removeEventListener("resize", hide);
    };
  }, [disabled]);
  if (!tip) return null;
  const width = Math.min(280, window.innerWidth - 24);
  return createPortal(
    <div
      className="wam-help-tip"
      style={{
        width,
        left: Math.max(
          12,
          Math.min(tip.rect.left, window.innerWidth - width - 12),
        ),
        ...(tip.rect.bottom + 160 > window.innerHeight
          ? { bottom: Math.max(12, window.innerHeight - tip.rect.top + 8) }
          : { top: tip.rect.bottom + 8 }),
      }}
    >
      {tip.text}
    </div>,
    document.body,
  );
}
