import { useEffect, useState } from "react";

export const AUTH_STORAGE_KEY = "my-fitness-hub-auth";
export const PROFILE_STORAGE_KEY = "my-fitness-hub-profile";

type AuthState = {
  isAuthenticated: boolean;
  currentUser: string | null;
};

type ProfileState = {
  name: string;
  avatar: string | null;
};

const defaultAuth: AuthState = {
  isAuthenticated: false,
  currentUser: null,
};

const defaultProfile: ProfileState = {
  name: "Ana",
  avatar: null,
};

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? { ...fallback, ...JSON.parse(raw) } : fallback;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event("my-fitness-hub-auth-change"));
}

export function useAuthProfile() {
  const [auth, setAuth] = useState<AuthState>(defaultAuth);
  const [profile, setProfile] = useState<ProfileState>(defaultProfile);
  const [hasLoaded, setHasLoaded] = useState(false);

  function refresh() {
    setAuth(readJson(AUTH_STORAGE_KEY, defaultAuth));
    setProfile(readJson(PROFILE_STORAGE_KEY, defaultProfile));
    setHasLoaded(true);
  }

  useEffect(() => {
    refresh();
    window.addEventListener("storage", refresh);
    window.addEventListener("my-fitness-hub-auth-change", refresh);

    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("my-fitness-hub-auth-change", refresh);
    };
  }, []);

  function login(user: string, password: string) {
    const isValid = user.trim().toLowerCase() === "ana" && password === "9109";

    if (!isValid) {
      return false;
    }

    const nextAuth = {
      isAuthenticated: true,
      currentUser: "Ana",
    };

    writeJson(AUTH_STORAGE_KEY, nextAuth);
    writeJson(PROFILE_STORAGE_KEY, { ...profile, name: "Ana" });
    setAuth(nextAuth);
    setProfile((current) => ({ ...current, name: "Ana" }));

    return true;
  }

  function logout() {
    const nextAuth = defaultAuth;

    writeJson(AUTH_STORAGE_KEY, nextAuth);
    setAuth(nextAuth);
  }

  function saveAvatar(avatar: string) {
    const nextProfile = {
      ...profile,
      avatar,
    };

    writeJson(PROFILE_STORAGE_KEY, nextProfile);
    setProfile(nextProfile);
  }

  return {
    auth,
    profile,
    hasLoaded,
    login,
    logout,
    saveAvatar,
  };
}
