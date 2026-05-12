import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Dumbbell,
  Salad,
  TrendingUp,
  CheckCircle2,
  LogOut,
} from "lucide-react";

import { BrandLogo } from "@/components/BrandLogo";
import { UserAvatar } from "@/components/UserAvatar";
import { useAuthProfile } from "@/hooks/use-auth-profile";

const items = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Treinos", url: "/treinos", icon: Dumbbell },
  { title: "Dieta", url: "/dieta", icon: Salad },
  { title: "Evolução", url: "/evolucao", icon: TrendingUp },
  { title: "Hábitos", url: "/habitos", icon: CheckCircle2 },
];

export function AppSidebar() {
  const currentPath = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const { logout } = useAuthProfile();

  function handleLogout() {
    logout();
    navigate({ to: "/login" });
  }

  return (
    <aside className="hidden md:flex w-64 shrink-0 flex-col bg-sidebar border-r border-sidebar-border">
      <div className="flex items-center gap-2 px-6 py-6 border-b border-sidebar-border">
        <BrandLogo size="sm" />
        <div>
          <div className="text-lg font-bold tracking-tight">ValkyrFit</div>
          <div className="text-[11px] text-muted-foreground -mt-0.5">Strength in Every Rep</div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {items.map((item) => {
          const active = currentPath === item.url;
          const Icon = item.icon;
          return (
            <Link
              key={item.url}
              to={item.url}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                active
                  ? "bg-sidebar-accent text-neon"
                  : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.title}
              {active && <span className="ml-auto h-2 w-2 rounded-full bg-neon glow-neon" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-sidebar-border">
        <div className="px-3 py-2.5">
          <UserAvatar size="sm" showName />
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-all"
        >
          <LogOut className="h-4 w-4" />
          Sair
        </button>
      </div>
    </aside>
  );
}

export function MobileNav() {
  const currentPath = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-sidebar/95 backdrop-blur border-t border-sidebar-border">
      <div className="grid grid-cols-5">
        {items.map((item) => {
          const active = currentPath === item.url;
          const Icon = item.icon;
          return (
            <Link
              key={item.url}
              to={item.url}
              className={`flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium ${
                active ? "text-neon" : "text-muted-foreground"
              }`}
            >
              <Icon className="h-5 w-5" />
              {item.title}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
