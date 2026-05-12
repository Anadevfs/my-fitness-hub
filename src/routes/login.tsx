import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { type FormEvent, useEffect, useState } from "react";

import { BrandLogo } from "@/components/BrandLogo";
import { useAuthProfile } from "@/hooks/use-auth-profile";

export const Route = createFileRoute("/login")({
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const { auth, hasLoaded, login } = useAuthProfile();
  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (hasLoaded && auth.isAuthenticated) {
      navigate({ to: "/" });
    }
  }, [auth.isAuthenticated, hasLoaded, navigate]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (login(user, pwd)) {
      navigate({ to: "/" });
      return;
    }

    setError("Usuária ou senha inválidos.");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,oklch(0.86_0.22_148/0.15),transparent_60%),radial-gradient(circle_at_70%_80%,oklch(0.62_0.22_295/0.15),transparent_60%)]" />
      <div className="relative w-full max-w-md card-elevated rounded-3xl p-8">
        <div className="flex flex-col items-center mb-8">
          <BrandLogo size="lg" className="mb-4" />
          <h1 className="text-3xl font-bold tracking-tight">ValkyrFit</h1>
          <p className="text-sm text-muted-foreground mt-1">Strength in Every Rep</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground">Usuária</label>
            <input
              type="text" value={user} onChange={(e) => setUser(e.target.value)}
              className="mt-1.5 w-full bg-input border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-neon"
              placeholder="Ana"
              autoComplete="username"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground">Senha</label>
            <input
              type="password" value={pwd} onChange={(e) => setPwd(e.target.value)}
              className="mt-1.5 w-full bg-input border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-neon"
              placeholder="9109"
              autoComplete="current-password"
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <button className="w-full bg-neon text-primary-foreground font-semibold py-3 rounded-xl hover:opacity-90 transition glow-neon">
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
