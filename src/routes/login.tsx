import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Flame } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/login")({
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,oklch(0.86_0.22_148/0.15),transparent_60%),radial-gradient(circle_at_70%_80%,oklch(0.62_0.22_295/0.15),transparent_60%)]" />
      <div className="relative w-full max-w-md card-elevated rounded-3xl p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="h-14 w-14 rounded-2xl gradient-primary flex items-center justify-center glow-neon mb-4">
            <Flame className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Treinos</h1>
          <p className="text-sm text-muted-foreground mt-1">Seu fitness tracker pessoal</p>
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); navigate({ to: "/" }); }}
          className="space-y-4"
        >
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground">Usuário ou e-mail</label>
            <input
              type="text" value={email} onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 w-full bg-input border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-neon"
              placeholder="seu@email.com"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground">Senha</label>
            <input
              type="password" value={pwd} onChange={(e) => setPwd(e.target.value)}
              className="mt-1.5 w-full bg-input border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-neon"
              placeholder="••••••••"
            />
          </div>
          <button className="w-full bg-neon text-primary-foreground font-semibold py-3 rounded-xl hover:opacity-90 transition glow-neon">
            Entrar
          </button>
        </form>
        <Link to="/" className="block text-center text-xs text-muted-foreground mt-6 hover:text-neon">
          Continuar sem login (demo)
        </Link>
      </div>
    </div>
  );
}
