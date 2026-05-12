import { useEffect, useState } from "react";

export const EVOLUTION_STORAGE_KEY = "my-fitness-hub-evolution";

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
}

export function useEvolutionSettings() {
  const [settings, setSettings] = useState<EvolutionSettings>(defaultEvolutionSettings);

  useEffect(() => {
    setSettings(readEvolutionSettings());
  }, []);

  function saveSettings(nextSettings: EvolutionSettings) {
    setSettings(nextSettings);
    writeEvolutionSettings(nextSettings);
  }

  return [settings, saveSettings] as const;
}
