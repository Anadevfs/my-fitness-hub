import { useCallback, useEffect, useState } from "react";

export const NOTIFICATIONS_ENABLED_KEY = "valkyrfit-notifications-enabled";
export const NOTIFICATIONS_SHOWN_KEY = "valkyrfit-notifications-shown";

type ShownNotifications = Record<string, string[]>;

type NotificationPayload = {
  body: string;
  id: string;
  scopeKey: string;
  title?: string;
};

function hasNotificationSupport() {
  return typeof window !== "undefined" && "Notification" in window;
}

function readEnabled() {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(NOTIFICATIONS_ENABLED_KEY) === "true";
}

function readShownNotifications(): ShownNotifications {
  if (typeof window === "undefined") return {};

  try {
    const raw = window.localStorage.getItem(NOTIFICATIONS_SHOWN_KEY);
    return raw ? (JSON.parse(raw) as ShownNotifications) : {};
  } catch {
    return {};
  }
}

function writeShownNotifications(value: ShownNotifications) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(NOTIFICATIONS_SHOWN_KEY, JSON.stringify(value));
}

export function useNotifications() {
  const [enabled, setEnabled] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [shownNotifications, setShownNotifications] = useState<ShownNotifications>(() =>
    readShownNotifications(),
  );
  const supported = hasNotificationSupport();

  useEffect(() => {
    setEnabled(readEnabled());
    setShownNotifications(readShownNotifications());

    if (hasNotificationSupport()) {
      setPermission(window.Notification.permission);
    }
  }, []);

  async function requestNotifications() {
    if (!hasNotificationSupport()) {
      setEnabled(false);
      return "denied" as NotificationPermission;
    }

    const nextPermission = await window.Notification.requestPermission();
    setPermission(nextPermission);

    const nextEnabled = nextPermission === "granted";
    setEnabled(nextEnabled);
    window.localStorage.setItem(NOTIFICATIONS_ENABLED_KEY, String(nextEnabled));

    return nextPermission;
  }

  function disableNotifications() {
    setEnabled(false);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(NOTIFICATIONS_ENABLED_KEY, "false");
    }
  }

  const notifyOnce = useCallback(
    ({ body, id, scopeKey, title = "ValkyrFit" }: NotificationPayload) => {
      if (!hasNotificationSupport() || !enabled || window.Notification.permission !== "granted") {
        return;
      }

      const currentShown = readShownNotifications();
      const alreadyShown = currentShown[scopeKey]?.includes(id);

      if (alreadyShown) return;

      try {
        new window.Notification(title, {
          body,
          icon: "/icon-192.png",
          tag: `valkyrfit-${scopeKey}-${id}`,
        });
      } catch {
        return;
      }

      const nextShown = {
        ...currentShown,
        [scopeKey]: [...(currentShown[scopeKey] ?? []), id],
      };
      writeShownNotifications(nextShown);
      setShownNotifications(nextShown);
    },
    [enabled],
  );

  return {
    disableNotifications,
    enabled,
    notifyOnce,
    permission,
    requestNotifications,
    shownNotifications,
    supported,
  };
}
