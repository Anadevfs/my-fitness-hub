import { useEffect, useMemo, useState } from "react";

export const WATER_SETTINGS_STORAGE_KEY = "my-fitness-hub-water-settings";
const WATER_SETTINGS_EVENT = "valkyrfit-water-settings-updated";

export type WaterSettings = {
  bottleCount: number;
  bottleVolumeMl: number;
};

export const defaultWaterSettings: WaterSettings = {
  bottleCount: 5,
  bottleVolumeMl: 600,
};

function readWaterSettings() {
  if (typeof window === "undefined") return defaultWaterSettings;

  try {
    const raw = window.localStorage.getItem(WATER_SETTINGS_STORAGE_KEY);
    return raw ? { ...defaultWaterSettings, ...JSON.parse(raw) } : defaultWaterSettings;
  } catch {
    return defaultWaterSettings;
  }
}

function writeWaterSettings(settings: WaterSettings) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(WATER_SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  window.dispatchEvent(new Event(WATER_SETTINGS_EVENT));
}

export function getWaterGoalLiters(settings: WaterSettings) {
  return (settings.bottleCount * settings.bottleVolumeMl) / 1000;
}

export function getWaterItems(settings: WaterSettings) {
  return Array.from({ length: settings.bottleCount }, (_, index) => `Garrafa ${index + 1}`);
}

export function useWaterSettings() {
  const [settings, setSettings] = useState<WaterSettings>(defaultWaterSettings);

  useEffect(() => {
    setSettings(readWaterSettings());
  }, []);

  useEffect(() => {
    function syncSettings(event?: Event) {
      if (event instanceof StorageEvent && event.key !== WATER_SETTINGS_STORAGE_KEY) return;
      setSettings(readWaterSettings());
    }

    window.addEventListener("storage", syncSettings);
    window.addEventListener(WATER_SETTINGS_EVENT, syncSettings);

    return () => {
      window.removeEventListener("storage", syncSettings);
      window.removeEventListener(WATER_SETTINGS_EVENT, syncSettings);
    };
  }, []);

  function saveSettings(nextSettings: WaterSettings) {
    const normalized = {
      bottleCount: Math.max(1, Number(nextSettings.bottleCount) || defaultWaterSettings.bottleCount),
      bottleVolumeMl: Math.max(
        1,
        Number(nextSettings.bottleVolumeMl) || defaultWaterSettings.bottleVolumeMl,
      ),
    };

    setSettings(normalized);
    writeWaterSettings(normalized);
  }

  const items = useMemo(() => getWaterItems(settings), [settings]);
  const goalLiters = getWaterGoalLiters(settings);

  return {
    goalLiters,
    items,
    saveSettings,
    settings,
  };
}
