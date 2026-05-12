import { Camera, User } from "lucide-react";
import { type ChangeEvent, useRef, useState } from "react";

import { useAuthProfile } from "@/hooks/use-auth-profile";

type UserAvatarProps = {
  size?: "sm" | "lg";
  showName?: boolean;
};

export function UserAvatar({ size = "lg", showName = false }: UserAvatarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { profile, saveAvatar } = useAuthProfile();
  const [error, setError] = useState("");
  const isSmall = size === "sm";

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setError("");

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Escolha uma imagem.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        saveAvatar(reader.result);
      }
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  }

  return (
    <div className={showName ? "flex items-center gap-3" : ""}>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={`relative shrink-0 rounded-full border border-border bg-secondary/60 overflow-hidden flex items-center justify-center hover:border-neon/50 transition ${
          isSmall ? "h-10 w-10" : "h-16 w-16"
        }`}
        aria-label="Alterar avatar"
        title="Alterar avatar"
      >
        {profile.avatar ? (
          <img src={profile.avatar} alt="Avatar de Ana" className="h-full w-full object-cover" />
        ) : (
          <User className={isSmall ? "h-5 w-5 text-muted-foreground" : "h-8 w-8 text-muted-foreground"} />
        )}
        <span className="absolute bottom-0 right-0 rounded-full bg-neon p-1 text-primary-foreground">
          <Camera className={isSmall ? "h-2.5 w-2.5" : "h-3.5 w-3.5"} />
        </span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      {showName && (
        <div className="min-w-0">
          <div className="font-semibold leading-tight">{profile.name}</div>
          <div className="text-xs text-muted-foreground">Perfil pessoal</div>
          {error && <div className="text-[11px] text-destructive mt-1">{error}</div>}
        </div>
      )}
    </div>
  );
}
