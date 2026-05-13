import { createFileRoute } from "@tanstack/react-router";
import {
  Bell,
  Camera,
  Database,
  Download,
  Droplet,
  Save,
  Scale,
  Settings,
  Trash2,
  type LucideIcon,
  Upload,
  User,
} from "lucide-react";
import { type ChangeEvent, type FormEvent, useEffect, useRef, useState } from "react";

import { useAuthProfile } from "@/hooks/use-auth-profile";
import {
  defaultEvolutionSettings,
  type EvolutionSettings,
  useEvolutionSettings,
} from "@/hooks/use-evolution-settings";
import { useBackupData } from "@/hooks/use-backup-data";
import { useNotifications } from "@/hooks/use-notifications";
import {
  defaultWaterSettings,
  type WaterSettings,
  useWaterSettings,
} from "@/hooks/use-water-settings";

export const Route = createFileRoute("/configuracoes")({
  component: Configuracoes,
});

function Configuracoes() {
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const { profile, saveAvatar, saveName } = useAuthProfile();
  const [evolutionSettings, saveEvolutionSettings] = useEvolutionSettings();
  const waterSettings = useWaterSettings();
  const notifications = useNotifications();
  const backup = useBackupData();
  const [nameDraft, setNameDraft] = useState(profile.name);
  const [waterDraft, setWaterDraft] = useState<WaterSettings>(defaultWaterSettings);
  const [weightDraft, setWeightDraft] = useState<EvolutionSettings>(defaultEvolutionSettings);
  const [feedback, setFeedback] = useState("");
  const waterGoalMl = waterDraft.bottleCount * waterDraft.bottleVolumeMl;

  useEffect(() => {
    setNameDraft(profile.name);
  }, [profile.name]);

  useEffect(() => {
    setWaterDraft(waterSettings.settings);
  }, [waterSettings.settings]);

  useEffect(() => {
    setWeightDraft(evolutionSettings);
  }, [evolutionSettings]);

  function handleAvatarChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setFeedback("");

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setFeedback("Escolha uma imagem válida.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        saveAvatar(reader.result);
        setFeedback("Avatar atualizado.");
      }
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  }

  function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    saveName(nameDraft);
    setFeedback("Configurações salvas.");
  }

  function saveGoals(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    waterSettings.saveSettings(waterDraft);
    saveEvolutionSettings({
      initialWeight: Number(weightDraft.initialWeight),
      currentWeight: Number(weightDraft.currentWeight),
      goalWeight: Number(weightDraft.goalWeight),
    });
    setFeedback("Configurações salvas.");
  }

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <header className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">Configurações</h1>
          <p className="text-muted-foreground mt-2">Ajustes pessoais e dados locais do ValkyrFit.</p>
        </div>
        {feedback ? (
          <div className="rounded-xl border border-neon/30 bg-neon/10 px-4 py-2 text-sm font-semibold text-neon">
            {feedback}
          </div>
        ) : null}
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="card-elevated rounded-2xl p-6">
          <SectionTitle icon={User} title="Perfil" description="Nome e foto de perfil." />
          <form onSubmit={saveProfile} className="mt-5 space-y-5">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border border-border bg-secondary/60 flex items-center justify-center hover:border-neon/50 transition"
                aria-label="Alterar avatar"
              >
                {profile.avatar ? (
                  <img src={profile.avatar} alt="Avatar de Ana" className="h-full w-full object-cover" />
                ) : (
                  <User className="h-9 w-9 text-muted-foreground" />
                )}
                <span className="absolute bottom-1 right-1 rounded-full bg-neon p-1.5 text-primary-foreground">
                  <Camera className="h-3.5 w-3.5" />
                </span>
              </button>
              <div className="min-w-0 flex-1">
                <Label text="Nome da usuária" />
                <input
                  value={nameDraft}
                  onChange={(event) => setNameDraft(event.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
            <SaveButton />
          </form>
        </section>

        <section className="card-elevated rounded-2xl p-6">
          <SectionTitle icon={Scale} title="Metas" description="Água e evolução corporal." />
          <form onSubmit={saveGoals} className="mt-5 space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <NumberField
                label="Garrafas por dia"
                value={waterDraft.bottleCount}
                onChange={(value) => setWaterDraft((current) => ({ ...current, bottleCount: value }))}
              />
              <NumberField
                label="Volume por garrafa (ml)"
                value={waterDraft.bottleVolumeMl}
                onChange={(value) => setWaterDraft((current) => ({ ...current, bottleVolumeMl: value }))}
              />
            </div>
            <div className="rounded-xl border border-border bg-secondary/30 p-4 text-sm text-muted-foreground">
              Meta de água: <span className="font-semibold text-neon">{formatMl(waterGoalMl)}</span>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <NumberField
                label="Peso inicial"
                step="0.1"
                value={weightDraft.initialWeight}
                onChange={(value) => setWeightDraft((current) => ({ ...current, initialWeight: value }))}
              />
              <NumberField
                label="Peso atual"
                step="0.1"
                value={weightDraft.currentWeight}
                onChange={(value) => setWeightDraft((current) => ({ ...current, currentWeight: value }))}
              />
              <NumberField
                label="Meta de peso"
                step="0.1"
                value={weightDraft.goalWeight}
                onChange={(value) => setWeightDraft((current) => ({ ...current, goalWeight: value }))}
              />
            </div>
            <SaveButton />
          </form>
        </section>

        <section className="card-elevated rounded-2xl p-6">
          <SectionTitle icon={Settings} title="Preferências" description="Preferências simples do PWA." />
          <div className="mt-5 space-y-4">
            <div className="rounded-xl border border-border bg-secondary/30 p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Bell className="h-4 w-4 text-accent" />
                  <div>
                    <div className="text-sm font-semibold">Notificações internas</div>
                    <div className="text-xs text-muted-foreground">
                      {notifications.supported
                        ? notifications.permission === "denied"
                          ? "Permissão bloqueada no navegador."
                          : "Avisos locais com o app aberto."
                        : "Não suportado neste navegador."}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  disabled={!notifications.supported}
                  onClick={
                    notifications.enabled
                      ? notifications.disableNotifications
                      : notifications.requestNotifications
                  }
                  className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                    notifications.enabled
                      ? "border border-neon/30 bg-neon/10 text-neon"
                      : "border border-border bg-muted/40 text-muted-foreground hover:border-neon/40 hover:text-neon"
                  } ${!notifications.supported ? "cursor-not-allowed opacity-60" : ""}`}
                >
                  {notifications.enabled ? "Ativas" : "Ativar"}
                </button>
              </div>
            </div>
            <PreferenceStatic icon={Droplet} label="Tema" value="Dark padrão" />
            <PreferenceStatic icon={Settings} label="Nome do app" value="ValkyrFit" />
          </div>
        </section>

        <section className="card-elevated rounded-2xl p-6">
          <SectionTitle icon={Database} title="Backup e dados" description="Exportação e restauração local." />
          {backup.status.message ? (
            <div
              className={`mt-5 rounded-xl border px-3 py-2 text-xs font-semibold ${
                backup.status.tone === "error"
                  ? "border-destructive/30 bg-destructive/10 text-destructive"
                  : "border-neon/30 bg-neon/10 text-neon"
              }`}
            >
              {backup.status.message}
            </div>
          ) : null}
          <input
            ref={backup.fileInputRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(event) => {
              backup.importBackup(event.target.files?.[0] ?? null);
              event.target.value = "";
            }}
          />
          <div className="mt-5 grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            <ActionButton icon={Download} label="Exportar backup" onClick={backup.exportBackup} />
            <ActionButton icon={Upload} label="Importar backup" onClick={backup.openImportPicker} />
            <ActionButton icon={Trash2} label="Resetar aplicativo" onClick={backup.resetAppData} danger />
          </div>
        </section>
      </div>
    </div>
  );
}

const inputClass =
  "mt-2 w-full rounded-xl border border-border bg-secondary/40 px-3 py-2.5 text-sm outline-none focus:border-neon";

function Label({ text }: { text: string }) {
  return <span className="text-xs uppercase tracking-wider text-muted-foreground">{text}</span>;
}

function NumberField({
  label,
  onChange,
  step = "1",
  value,
}: {
  label: string;
  onChange: (value: number) => void;
  step?: string;
  value: number;
}) {
  return (
    <label>
      <Label text={label} />
      <input
        type="number"
        min="0"
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className={inputClass}
      />
    </label>
  );
}

function SectionTitle({
  description,
  icon: Icon,
  title,
}: {
  description: string;
  icon: LucideIcon;
  title: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-10 w-10 rounded-xl bg-neon/15 text-neon flex items-center justify-center">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h2 className="font-semibold">{title}</h2>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

function SaveButton() {
  return (
    <button
      type="submit"
      className="rounded-xl bg-neon px-5 py-2.5 text-sm font-semibold text-primary-foreground glow-neon hover:opacity-90 transition inline-flex items-center gap-2"
    >
      <Save className="h-4 w-4" />
      Salvar
    </button>
  );
}

function PreferenceStatic({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-secondary/30 p-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <Icon className="h-4 w-4 text-accent" />
        <span className="text-sm font-semibold">{label}</span>
      </div>
      <span className="text-xs text-muted-foreground">{value}</span>
    </div>
  );
}

function ActionButton({
  danger,
  icon: Icon,
  label,
  onClick,
}: {
  danger?: boolean;
  icon: LucideIcon;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border px-4 py-3 text-sm font-semibold transition inline-flex items-center justify-center gap-2 ${
        danger
          ? "border-destructive/30 bg-destructive/10 text-destructive hover:border-destructive/50"
          : "border-border bg-secondary/40 text-muted-foreground hover:border-neon/40 hover:text-neon"
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

function formatMl(value: number) {
  if (value >= 1000) {
    return `${(value / 1000).toLocaleString("pt-BR", { maximumFractionDigits: 1 })}L por dia`;
  }

  return `${value}ml por dia`;
}
