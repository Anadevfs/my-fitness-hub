import { useEffect, useState } from "react";

export const EVOLUTION_STORAGE_KEY = "my-fitness-hub-evolution";
const EVOLUTION_SETTINGS_EVENT = "valkyrfit-evolution-settings-updated";

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

export function useEvolutionSettings() {
  const [settings, setSettings] = useState<EvolutionSettings>(defaultEvolutionSettings);

  useEffect(() => {
    setSettings(readEvolutionSettings());
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
  }

  return [settings, saveSettings] as const;
}
