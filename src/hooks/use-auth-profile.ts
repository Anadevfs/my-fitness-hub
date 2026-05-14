import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

export const AUTH_STORAGE_KEY = "my-fitness-hub-auth";
export const PROFILE_STORAGE_KEY = "my-fitness-hub-profile";
const EVOLUTION_STORAGE_KEY = "my-fitness-hub-evolution";
const USER_DATA_TABLE = "user_data";

type AuthState = {
  isAuthenticated: boolean;
  currentUser: string | null;
  email: string | null;
  userId: string | null;
};

type ProfileState = {
  name: string;
  avatar: string | null;
};

const defaultAuth: AuthState = {
  isAuthenticated: false,
  currentUser: null,
  email: null,
  userId: null,
};

const defaultProfile: ProfileState = {
  name: "Ana",
  avatar: null,
};

type UserDataRow = {
  id: string;
  data: Record<string, unknown> | null;
  updated_at?: string | null;
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

function readLocalEvolutionData() {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(EVOLUTION_STORAGE_KEY);
    return raw ? { evolution: JSON.parse(raw) } : {};
  } catch {
    return {};
  }
}

async function ensureUserData(userId: string) {
  const { data: existingRows, error: readError } = await supabase
    .from(USER_DATA_TABLE)
    .select("id,data,updated_at")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })
    .limit(1)
    .returns<UserDataRow[]>();

  if (readError) {
    throw readError;
  }

  if (existingRows?.[0]) {
    return;
  }

  const { error: insertError } = await supabase.from(USER_DATA_TABLE).insert({
    user_id: userId,
    data: readLocalEvolutionData(),
  });

  if (insertError) {
    throw insertError;
  }
}

function getAuthFromUser(user: { id: string; email?: string | null }): AuthState {
  const storedProfile = readJson(PROFILE_STORAGE_KEY, defaultProfile);

  return {
    isAuthenticated: true,
    currentUser: storedProfile.name || user.email || defaultProfile.name,
    email: user.email ?? null,
    userId: user.id,
  };
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
    let isMounted = true;

    async function loadSession() {
      setProfile(readJson(PROFILE_STORAGE_KEY, defaultProfile));

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!isMounted) return;

      if (!session?.user) {
        writeJson(AUTH_STORAGE_KEY, defaultAuth);
        setAuth(defaultAuth);
        setHasLoaded(true);
        return;
      }

      const nextAuth = getAuthFromUser(session.user);
      writeJson(AUTH_STORAGE_KEY, nextAuth);
      setAuth(nextAuth);
      setHasLoaded(true);
      ensureUserData(session.user.id).catch((error) => {
        console.warn("ValkyrFit: falha ao garantir user_data no Supabase.", error);
      });
    }

    loadSession().catch(() => {
      if (!isMounted) return;
      setAuth(defaultAuth);
      setHasLoaded(true);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;

      if (!session?.user) {
        writeJson(AUTH_STORAGE_KEY, defaultAuth);
        setAuth(defaultAuth);
        return;
      }

      const nextAuth = getAuthFromUser(session.user);
      writeJson(AUTH_STORAGE_KEY, nextAuth);
      setAuth(nextAuth);
      ensureUserData(session.user.id).catch((error) => {
        console.warn("ValkyrFit: falha ao garantir user_data no Supabase.", error);
      });
    });

    window.addEventListener("storage", refresh);
    window.addEventListener("my-fitness-hub-auth-change", refresh);

    return () => {
      isMounted = false;
      subscription.unsubscribe();
      window.removeEventListener("storage", refresh);
      window.removeEventListener("my-fitness-hub-auth-change", refresh);
    };
  }, []);

  async function login(email: string, password: string) {
    const storedProfile = readJson(PROFILE_STORAGE_KEY, defaultProfile);
    const nextProfile = {
      ...storedProfile,
      name: storedProfile.name || defaultProfile.name,
    };
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error || !data.user) {
      return false;
    }

    const nextAuth = getAuthFromUser(data.user);

    writeJson(AUTH_STORAGE_KEY, nextAuth);
    writeJson(PROFILE_STORAGE_KEY, nextProfile);
    setAuth(nextAuth);
    setProfile(nextProfile);
    await ensureUserData(data.user.id).catch((error) => {
      console.warn("ValkyrFit: falha ao garantir user_data no Supabase.", error);
    });

    return true;
  }

  async function logout() {
    await supabase.auth.signOut();
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

  function saveName(name: string) {
    const nextProfile = {
      ...profile,
      name: name.trim() || defaultProfile.name,
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
    saveName,
  };
}
