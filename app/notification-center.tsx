import { useEffect, useRef, useState } from "react";
import { Popover } from "radix-ui";
import { Bell, X } from "lucide-react";
import { cloudRequest } from "../lib/cloud-workspace";
import { user, mutate } from "../lib/preview-store";
import {
  deviceNotificationSupport,
  enableDeviceNotifications,
  restoreDeviceNotifications,
  disableDeviceNotifications,
  setDeviceAccount,
  setAppBadge,
} from "../lib/device-notifications";
import { useWorkspace } from "./operations";
import WorkspacePortal from "./workspace-portal";

export default function NotificationCenter({
  onOpen,
}: {
  onOpen: (item: any) => void;
}) {
  const state = useWorkspace();
  const me = user();
  const cloud = !!sessionStorage.getItem("wam-cloud-auth");
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [publicKey, setPublicKey] = useState("");
  const [error, setError] = useState("");
  const [enabled, setEnabled] = useState(false);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<any>(null);
  const seen = useRef<Set<string> | null>(null);
  const openRef = useRef(onOpen);
  openRef.current = onOpen;
  const refresh = useRef<() => Promise<any[]>>(async () => []);
  const localRead = state.preferences[me.id]?.notificationReadAt || "";
  const visible = cloud
    ? items
    : (state.activity || []).slice(0, 50).map((a: any) => ({
        ...a,
        title: a.by + " · " + a.text,
        summary: "Workspace update",
        createdAt: a.at,
        read: a.at <= localRead,
        category: "activity",
      }));
  const unread = visible.filter((item: any) => !item.read).length;
  useEffect(() => {
    void setAppBadge(unread);
  }, [unread, me.id]);
  useEffect(() => {
    let stopped = false,
      loading = false;
    seen.current = null;
    setItems([]);
    setError("");
    setEnabled(false);
    setToast(null);
    void setDeviceAccount(me.id).catch(() => {});
    async function load() {
      if (stopped || loading || !cloud) return [];
      loading = true;
      try {
        const data = await cloudRequest("notifications");
        if (stopped) return [];
        const incoming = data.items || [];
        if (seen.current) {
          const message = incoming.find(
            (n: any) =>
              !seen.current!.has(n.id) && !n.read && n.category === "message",
          );
          if (message) setToast(message);
        }
        seen.current = new Set(incoming.map((n: any) => n.id));
        setItems(incoming);
        setPublicKey(data.publicKey);
        setError("");
        return incoming;
      } catch (e: any) {
        if (!stopped) setError(e.message);
        return [];
      } finally {
        loading = false;
      }
    }
    refresh.current = load;
    const pending = new URLSearchParams(location.search).get(
      "wam-notification",
    );
    load().then((rows) => {
      if (stopped || !pending) return;
      const item = rows.find((n: any) => n.id === pending);
      if (item) openRef.current(item);
      const url = new URL(location.href);
      url.searchParams.delete("wam-notification");
      history.replaceState({}, "", url);
    });
    if (cloud)
      void restoreDeviceNotifications(me.id)
        .then((value) => {
          if (!stopped) setEnabled(value);
        })
        .catch(() => {});
    const timer = setInterval(() => {
      if (document.visibilityState === "visible") void load();
    }, 8000);
    const visibility = () => {
      if (document.visibilityState === "visible") void load();
    };
    const message = async (event: MessageEvent) => {
      if (event.data?.type !== "WAM_OPEN_NOTIFICATION") return;
      const rows = await load();
      const item = rows.find((n: any) => n.id === event.data.id);
      if (item && !stopped) openRef.current(item);
    };
    document.addEventListener("visibilitychange", visibility);
    navigator.serviceWorker?.addEventListener("message", message);
    return () => {
      stopped = true;
      clearInterval(timer);
      document.removeEventListener("visibilitychange", visibility);
      navigator.serviceWorker?.removeEventListener("message", message);
    };
  }, [me.id, cloud]);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 10000);
    return () => clearTimeout(timer);
  }, [toast]);
  async function markRead(item?: any) {
    try {
      if (cloud) {
        await cloudRequest(
          "notifications",
          item
            ? { action: "read", ids: [item.id] }
            : { action: "read", all: true },
        );
        setItems((current) =>
          current.map((n) =>
            !item || item.id === n.id ? { ...n, read: true } : n,
          ),
        );
      } else
        mutate((s) => {
          s.preferences[me.id] ||= {};
          s.preferences[me.id].notificationReadAt = new Date().toISOString();
        });
    } catch (e: any) {
      setError(e.message);
    }
  }
  function visit(item: any) {
    void markRead(item);
    setOpen(false);
    setToast(null);
    onOpen(item);
  }
  return (
    <>
      <Popover.Root
        open={open}
        onOpenChange={(value) => {
          setOpen(value);
          if (value) void refresh.current();
        }}
      >
        <Popover.Trigger asChild>
          <button
            type="button"
            className="icon notification-trigger"
            title="Notifications"
            aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`}
            data-help="See a short summary of recent work and messages."
          >
            <Bell size={18} />
            {unread > 0 && (
              <span className="notification-count">
                {unread > 99 ? "99+" : unread}
              </span>
            )}
          </button>
        </Popover.Trigger>
        {open && (
          <WorkspacePortal>
            <Popover.Content
              className="notification-panel"
              align="end"
              sideOffset={10}
              collisionPadding={10}
            >
              <div className="sectionhead">
                <h2>Notifications</h2>
                <Popover.Close asChild>
                  <button className="icon" aria-label="Close notifications">
                    <X size={18} />
                  </button>
                </Popover.Close>
              </div>
              <p>A quick look at what’s happening.</p>
              <div className="notification-controls">
                <small>{unread} unread</small>
                <button
                  type="button"
                  disabled={!unread}
                  onClick={() => void markRead()}
                >
                  Mark all read
                </button>
              </div>
              <div className="notification-items">
                {visible.map((item: any) => (
                  <button
                    type="button"
                    key={item.id}
                    className={
                      "notification-item " + (!item.read ? "unread" : "")
                    }
                    onClick={() => visit(item)}
                  >
                    <b>{item.title}</b>
                    <span>{item.summary}</span>
                    <time dateTime={item.createdAt}>
                      {new Date(item.createdAt).toLocaleString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </time>
                  </button>
                ))}
                {!visible.length && !error && (
                  <p>
                    You’re all caught up. New notes, work updates, and messages
                    will appear here.
                  </p>
                )}
              </div>
              {cloud && (
                <div className="notification-device">
                  <button
                    type="button"
                    disabled={busy || !publicKey}
                    onClick={async () => {
                      setBusy(true);
                      setError("");
                      try {
                        if (enabled) await disableDeviceNotifications();
                        else await enableDeviceNotifications(publicKey, me.id);
                        setEnabled(!enabled);
                      } catch (e: any) {
                        setError(e.message);
                      } finally {
                        setBusy(false);
                      }
                    }}
                  >
                    {busy
                      ? "Updating…"
                      : enabled
                        ? "Turn off phone notifications"
                        : "Enable phone notifications"}
                  </button>
                  <small>
                    {enabled
                      ? "This device will receive alerts and an unread app badge where supported."
                      : deviceNotificationSupport()
                        ? "Allow notifications for message alerts and app badges. On iPhone, open the app from your Home Screen."
                        : "Install Walker Suite on your Home Screen and open it there to enable phone alerts."}
                  </small>
                </div>
              )}
              {error && (
                <p role="alert" className="notice">
                  {error}
                </p>
              )}
            </Popover.Content>
          </WorkspacePortal>
        )}
      </Popover.Root>
      {toast && (
        <div className="message-toast" role="status">
          <button className="message-toast-open" onClick={() => visit(toast)}>
            <Bell size={18} />
            <span>
              <b>{toast.title}</b>
              <small>{toast.summary}</small>
            </span>
          </button>
          <button
            className="icon"
            aria-label="Dismiss notification"
            onClick={() => setToast(null)}
          >
            <X size={16} />
          </button>
        </div>
      )}
    </>
  );
}
