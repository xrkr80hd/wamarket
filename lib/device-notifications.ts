import { cloudRequest } from "./cloud-workspace";
export function deviceNotificationSupport() {
  return (
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
}
export async function deviceRegistration() {
  await navigator.serviceWorker.register("/local-files-worker.js");
  return navigator.serviceWorker.ready;
}
export async function setDeviceAccount(userId: string) {
  if (!("serviceWorker" in navigator)) return;
  const registration = await deviceRegistration();
  registration.active?.postMessage({ type: "WAM_ACCOUNT", userId });
}
export async function setAppBadge(count: number) {
  const badge = navigator as Navigator & {
    setAppBadge?: (n: number) => Promise<void>;
    clearAppBadge?: () => Promise<void>;
  };
  try {
    if (count > 0) await badge.setAppBadge?.(count);
    else await badge.clearAppBadge?.();
  } catch {}
  if ("serviceWorker" in navigator)
    navigator.serviceWorker.controller?.postMessage({
      type: "WAM_BADGE",
      count,
    });
}
export async function enableDeviceNotifications(
  publicKey: string,
  userId: string,
) {
  if (!deviceNotificationSupport())
    throw Error(
      "Open the installed Walker Suite app to enable phone notifications. This browser may not support them.",
    );
  // Request permission directly from the user's button tap.
  const permission = await Notification.requestPermission();
  if (permission !== "granted")
    throw Error(
      "Notifications are blocked. Allow them for Walker Suite in your phone or browser settings.",
    );
  const registration = await deviceRegistration();
  registration.active?.postMessage({ type: "WAM_ACCOUNT", userId });
  const bytes = Uint8Array.from(
    atob(publicKey.replace(/-/g, "+").replace(/_/g, "/")),
    (c) => c.charCodeAt(0),
  );
  const subscription =
    (await registration.pushManager.getSubscription()) ||
    (await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: bytes,
    }));
  await cloudRequest("notifications", {
    action: "subscribe",
    subscription: subscription.toJSON(),
  });
}
export async function restoreDeviceNotifications(userId: string) {
  if (!deviceNotificationSupport() || Notification.permission !== "granted")
    return false;
  const registration = await deviceRegistration();
  registration.active?.postMessage({ type: "WAM_ACCOUNT", userId });
  const subscription = await registration.pushManager.getSubscription();
  if (!subscription) return false;
  await cloudRequest("notifications", {
    action: "subscribe",
    subscription: subscription.toJSON(),
  });
  return true;
}
export async function disableDeviceNotifications() {
  const registration = await deviceRegistration();
  const subscription = await registration.pushManager.getSubscription();
  if (subscription) {
    await cloudRequest("notifications", {
      action: "unsubscribe",
      subscription: subscription.toJSON(),
    });
    await subscription.unsubscribe();
  }
}
