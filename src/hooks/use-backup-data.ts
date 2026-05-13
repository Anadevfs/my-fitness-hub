import { useRef, useState } from "react";

const BACKUP_FILE_NAME = "valkyrfit-backup.json";
const APP_STORAGE_PREFIXES = ["valkyrfit-", "my-fitness-hub-"];

type BackupStatus = {
  tone: "success" | "error" | "idle";
  message: string;
};

type BackupFile = {
  app: "ValkyrFit";
  version: 1;
  exportedAt: string;
  data: Record<string, string>;
};

function isAppStorageKey(key: string) {
  return APP_STORAGE_PREFIXES.some((prefix) => key.startsWith(prefix));
}

function getAppStorageData() {
  const data: Record<string, string> = {};

  if (typeof window === "undefined") return data;

  for (let index = 0; index < window.localStorage.length; index += 1) {
    const key = window.localStorage.key(index);
    if (!key || !isAppStorageKey(key)) continue;

    const value = window.localStorage.getItem(key);
    if (value !== null) data[key] = value;
  }

  return data;
}

function isBackupFile(value: unknown): value is BackupFile {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Partial<BackupFile>;
  if (candidate.app !== "ValkyrFit" || candidate.version !== 1) return false;
  if (!candidate.data || typeof candidate.data !== "object" || Array.isArray(candidate.data)) {
    return false;
  }

  return Object.entries(candidate.data).every(
    ([key, storedValue]) => isAppStorageKey(key) && typeof storedValue === "string",
  );
}

function refreshAppSoon() {
  window.setTimeout(() => {
    window.location.reload();
  }, 700);
}

export function useBackupData() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [status, setStatus] = useState<BackupStatus>({
    tone: "idle",
    message: "",
  });

  function exportBackup() {
    const backup: BackupFile = {
      app: "ValkyrFit",
      version: 1,
      exportedAt: new Date().toISOString(),
      data: getAppStorageData(),
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = BACKUP_FILE_NAME;
    link.click();
    URL.revokeObjectURL(url);

    setStatus({
      tone: "success",
      message: "Backup exportado.",
    });
  }

  function openImportPicker() {
    fileInputRef.current?.click();
  }

  function importBackup(file: File | null) {
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));

        if (!isBackupFile(parsed)) {
          throw new Error("Invalid ValkyrFit backup file.");
        }

        Object.entries(parsed.data).forEach(([key, value]) => {
          window.localStorage.setItem(key, value);
        });

        setStatus({
          tone: "success",
          message: "Dados restaurados. Atualizando app...",
        });
        refreshAppSoon();
      } catch {
        setStatus({
          tone: "error",
          message: "Erro ao importar. Selecione um JSON válido do ValkyrFit.",
        });
      }
    };

    reader.onerror = () => {
      setStatus({
        tone: "error",
        message: "Erro ao ler o arquivo de backup.",
      });
    };

    reader.readAsText(file);
  }

  function resetAppData() {
    const confirmed = window.confirm(
      "Tem certeza que deseja resetar os dados do ValkyrFit neste navegador?",
    );

    if (!confirmed) return;

    Object.keys(getAppStorageData()).forEach((key) => window.localStorage.removeItem(key));

    setStatus({
      tone: "success",
      message: "Dados do ValkyrFit resetados. Atualizando app...",
    });
    refreshAppSoon();
  }

  return {
    exportBackup,
    fileInputRef,
    importBackup,
    openImportPicker,
    resetAppData,
    status,
  };
}
