import { UserRound, ChevronDown } from "lucide-react";
import {
  startCloudWorkspace,
  stopCloudWorkspace,
  cloudRequest,
} from "../lib/cloud-workspace";
import { roleLabel } from "../lib/dashboard";
import React, { useEffect, useState, useRef } from "react";
import CloudAccounts from "./cloud-accounts";
import { people, setUser } from "../lib/preview-store";
async function request(route: string, body?: any) {
  const r = await fetch("/api/accounts?route=" + route, {
    method: body ? "POST" : "GET",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const d = await r.json();
  if (!r.ok)
    throw Object.assign(Error(d.error || "Unable to sign in."), {
      status: r.status,
    });
  return d;
}
export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [setupKey] = useState(() => {
      const k = new URLSearchParams(location.hash.slice(1)).get("setup") || "";
      if (k)
        history.replaceState(null, "", location.pathname + location.search);
      return k;
    }),
    [manage, U] = useState(false);
  const [account, A] = useState<any>(null),
    [loading, L] = useState(true),
    [email, E] = useState(
      () => new URLSearchParams(location.search).get("email") || "",
    ),
    [password, P] = useState(""),
    [showPassword, ShowPassword] = useState(false),
    [setup, S] = useState(Boolean(setupKey)),
    [busy, B] = useState(false),
    [error, X] = useState(""),
    [message, M] = useState("");
  const currentId = useRef("");
  const accountMenu = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const close = (event: PointerEvent) => {
      if (!accountMenu.current?.contains(event.target as Node))
        accountMenu.current?.removeAttribute("open");
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && accountMenu.current?.open) {
        accountMenu.current.removeAttribute("open");
        accountMenu.current.querySelector("summary")?.focus();
      }
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", escape);
    };
  }, []);
  const [cloudStatus, Status] = useState("Connecting…");
  useEffect(() => {
    const fn = (e: any) => Status(e.detail);
    window.addEventListener("wam-cloud-status", fn);
    return () => window.removeEventListener("wam-cloud-status", fn);
  }, []);
  async function accept(u: any) {
    const i = people.findIndex((p) => p.id === u.id);
    if (i < 0) people.push(u);
    else people[i] = u;
    sessionStorage.removeItem("wam-local-auth");
    sessionStorage.setItem("wam-cloud-auth", u.id);
    setUser(u.id);
    if (currentId.current !== u.id) {
      await startCloudWorkspace(u);
      currentId.current = u.id;
    }
    A(u);
  }
  useEffect(() => {
    let live = true;
    const check = () =>
      request("me")
        .then(async (d) => {
          if (live) {
            await accept(d.user);
            X("");
          }
        })
        .catch((e: any) => {
          if (live) {
            if (e.status === 401 || e.status === 403) A(null);
            if (!e.message.includes("Sign in")) X(e.message);
          }
        })
        .finally(() => {
          if (live) L(false);
        });
    check();
    const timer = setInterval(check, 60000);
    window.addEventListener("focus", check);
    window.addEventListener("wam-auth-refresh", check);
    return () => {
      live = false;
      clearInterval(timer);
      window.removeEventListener("focus", check);
      window.removeEventListener("wam-auth-refresh", check);
    };
  }, []);
  if (account)
    return (
      <>
        <div className="auth-session">
          <span className="session-identity">
            <b>{account.name}</b>
            <span className="session-role">
              {" "}
              · {roleLabel(account.role, account.isAdmin)}
            </span>
          </span>
          <small role="status">{cloudStatus}</small>
          <details className="session-menu" ref={accountMenu}>
            <summary aria-label="Account options">
              <UserRound size={16} />
              <span>Account</span>
              <ChevronDown size={13} />
            </summary>
            <div className="session-menu-panel">
              <div className="session-menu-identity">
                <b>{account.name}</b>
                <small>{roleLabel(account.role, account.isAdmin)}</small>
              </div>
              {account.isAdmin && (
                <button
                  onClick={() => {
                    U(!manage);
                    accountMenu.current?.removeAttribute("open");
                  }}
                >
                  Manage users
                </button>
              )}
              <button
                onClick={async () => {
                  try {
                    await cloudRequest("presence", { online: false }).catch(
                      () => {},
                    );
                    await request("logout", {});
                    stopCloudWorkspace();
                    currentId.current = "";
                    sessionStorage.removeItem("wam-cloud-auth");
                    A(null);
                    P("");
                  } catch (e: any) {
                    X(e.message);
                  }
                }}
              >
                Sign out
              </button>
            </div>
          </details>
          {error && <span role="alert">{error}</span>}
        </div>
        {manage ? (
          <div className="cloud-admin-page">
            <button onClick={() => U(false)}>← Back to workspace</button>
            <CloudAccounts />
          </div>
        ) : (
          children
        )}
      </>
    );
  return (
    <main className="signin-page">
      <form
        className="signin-card"
        onSubmit={async (e) => {
          e.preventDefault();
          B(true);
          X("");
          M("");
          try {
            const d = await request(setup ? "bootstrap" : "login", {
              email,
              password,
              setupKey,
            });
            P("");
            if (d.user) await accept(d.user);
            else {
              M(
                "Check your email to verify your account, then return here to sign in.",
              );
              S(false);
            }
          } catch (e: any) {
            X(e.message);
          } finally {
            B(false);
          }
        }}
      >
        <img src="/icons/walker-original.png" alt="Walker Marketing Suite" />
        <h1>{setup ? "Create your admin account" : "Welcome back"}</h1>
        <p>
          {loading
            ? "Checking your session…"
            : setup
              ? "Choose your password to open your workspace."
              : "Your team. Your projects. One workspace."}
        </p>
        {!loading && (
          <>
            <label>
              Email address
              <input
                type="email"
                autoComplete="username"
                required
                value={email}
                disabled={busy}
                onChange={(e) => E(e.target.value)}
              />
            </label>
            <label>
              Password
              <div className="password-entry">
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete={setup ? "new-password" : "current-password"}
                  required
                  minLength={setup ? 12 : undefined}
                  value={password}
                  onChange={(e) => P(e.target.value)}
                />
                <button type="button" aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => ShowPassword(!showPassword)}>{showPassword ? "Hide" : "Show"}</button>
              </div>
            </label>
            {error && <p role="alert">{error}</p>}
            {message && <p role="status">{message}</p>}
            <button disabled={busy} type="submit">
              {busy
                ? "Please wait…"
                : setup
                  ? "Create administrator account"
                  : "Sign in"}
            </button>
            {setupKey && (
              <button
                type="button"
                className="signin-back"
                onClick={() => {
                  S(!setup);
                  X("");
                  M("");
                }}
              >
                {setup ? "Back to sign in" : "Create administrator account"}
              </button>
            )}
            <small>Access is limited to approved team members.</small>
          </>
        )}
      </form>
    </main>
  );
}
