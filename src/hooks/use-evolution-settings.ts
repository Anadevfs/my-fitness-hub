import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

export const EVOLUTION_STORAGE_KEY = "my-fitness-hub-evolution";
const EVOLUTION_SETTINGS_EVENT = "valkyrfit-evolution-settings-updated";
const USER_DATA_TABLE = "user_data";

export type EvolutionSettings = {
  initialWeight: number;
  currentWeight: number;
  goalWeight: number;
};

export const defaultEvolutionSettings: EvolutionSettings = {
  initialWeight: 71,
  currentWeight: 65,
  goalWeight: 62,
};

type UserDataPayload = {
  evolution?: Partial<EvolutionSettings>;
  [key: string]: unknown;
};

type UserDataRow = {
  data: UserDataPayload | null;
};

function normalizeEvolutionSettings(value: unknown): EvolutionSettings | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const maybeSettings = value as Partial<Record<keyof EvolutionSettings, unknown>>;
  const initialWeight = Number(maybeSettings.initialWeight);
  const currentWeight = Number(maybeSettings.currentWeight);
  const goalWeight = Number(maybeSettings.goalWeight);

  if (![initialWeight, currentWeight, goalWeight].every(Number.isFinite)) {
    return null;
  }

  return {
    initialWeight,
    currentWeight,
    goalWeight,
  };
}

function readEvolutionSettings() {
  if (typeof window === "undefined") {
    return defaultEvolutionSettings;
  }

  try {
    const raw = window.localStorage.getItem(EVOLUTION_STORAGE_KEY);
    return raw ? { ...defaultEvolutionSettings, ...JSON.parse(raw) } : defaultEvolutionSettings;
  } catch {
    return defaultEvolutionSettings;
  }
}

function writeEvolutionSettings(settings: EvolutionSettings) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(EVOLUTION_STORAGE_KEY, JSON.stringify(settings));
  window.dispatchEvent(new Event(EVOLUTION_SETTINGS_EVENT));
}

async function getUserDataOwnerKey() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.id) {
    throw new Error("Supabase user session not found.");
  }

  return user.id;
}

async function readSupabaseEvolutionSettings() {
  const userId = await getUserDataOwnerKey();
  const { data, error } = await supabase
    .from(USER_DATA_TABLE)
    .select("data")
    .eq("user_id", userId)
    .maybeSingle<UserDataRow>();

  if (error) {
    throw error;
  }

  return normalizeEvolutionSettings(data?.data?.evolution);
}

async function writeSupabaseEvolutionSettings(settings: EvolutionSettings) {
  const userId = await getUserDataOwnerKey();
  const { data: existingRow, error: readError } = await supabase
    .from(USER_DATA_TABLE)
    .select("data")
    .eq("user_id", userId)
    .maybeSingle<UserDataRow>();

  if (readError) {
    throw readError;
  }

  const currentData = existingRow?.data ?? {};
  const { error: writeError } = await supabase.from(USER_DATA_TABLE).upsert(
    {
      user_id: userId,
      data: {
        ...currentData,
        evolution: settings,
      },
    },
    { onConflict: "user_id" },
  );

  if (writeError) {
    throw writeError;
  }
}

export function useEvolutionSettings() {
  const [settings, setSettings] = useState<EvolutionSettings>(defaultEvolutionSettings);

  useEffect(() => {
    let isMounted = true;
    const localSettings = readEvolutionSettings();

    setSettings(localSettings);

    readSupabaseEvolutionSettings()
      .then((remoteSettings) => {
        if (!isMounted) return;
        if (!remoteSettings) {
          writeSupabaseEvolutionSettings(localSettings).catch(() => undefined);
          return;
        }
        setSettings(remoteSettings);
        writeEvolutionSettings(remoteSettings);
      })
      .catch(() => {
        if (!isMounted) return;
        setSettings(localSettings);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    function syncSettings(event?: StorageEvent) {
      if (event && event.key !== EVOLUTION_STORAGE_KEY) return;
      setSettings(readEvolutionSettings());
    }

    window.addEventListener("storage", syncSettings);
    window.addEventListener(EVOLUTION_SETTINGS_EVENT, syncSettings);

    return () => {
      window.removeEventListener("storage", syncSettings);
      window.removeEventListener(EVOLUTION_SETTINGS_EVENT, syncSettings);
    };
  }, []);

  function saveSettings(nextSettings: EvolutionSettings) {
    setSettings(nextSettings);
    writeEvolutionSettings(nextSettings);
    writeSupabaseEvolutionSettings(nextSettings).catch(() => {
      setSettings(readEvolutionSettings());
    });
  }

  return [settings, saveSettings] as const;
}
