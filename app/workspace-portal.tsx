import {
  useLayoutEffect,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

// Portals must escape the header's stacking context and keep the active theme.
function scope() {
  const app =
    typeof document === "undefined"
      ? null
      : document.querySelector<HTMLElement>("#root .app.workspace-shell");
  const style: CSSProperties & Record<string, string | number | undefined> = {
    display: "contents",
  };
  if (app) {
    const computed = getComputedStyle(app);
    for (let i = 0; i < computed.length; i++) {
      const name = computed[i];
      if (name.startsWith("--")) style[name] = computed.getPropertyValue(name);
    }
  }
  return {
    className:
      "app workspace-shell workspace-floating-scope" +
      (app?.classList.contains("dark") ? " dark" : ""),
    style,
  };
}
export default function WorkspacePortal({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState(scope);
  useLayoutEffect(() => {
    const app = document.querySelector("#root .app.workspace-shell");
    if (!app) return;
    const observer = new MutationObserver(() => setTheme(scope()));
    observer.observe(app, {
      attributes: true,
      attributeFilter: ["class", "style"],
    });
    return () => observer.disconnect();
  }, []);
  if (typeof document === "undefined") return null;
  return createPortal(
    <div {...theme} data-workspace-portal="">
      {children}
    </div>,
    document.body,
  );
}
