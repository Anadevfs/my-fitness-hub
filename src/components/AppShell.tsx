import { AppSidebar, MobileNav } from "./AppSidebar";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";

import { useAuthProfile } from "@/hooks/use-auth-profile";

export function AppShell({ children }: { children: React.ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const { auth, hasLoaded } = useAuthProfile();

  useEffect(() => {
    if (path !== "/login" && hasLoaded && !auth.isAuthenticated) {
      navigate({ to: "/login" });
    }
  }, [auth.isAuthenticated, hasLoaded, navigate, path]);

  if (path === "/login") return <>{children}</>;

  if (!hasLoaded || !auth.isAuthenticated) {
    return <div className="min-h-screen bg-background" />;
  }

  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar />
      <main className="flex-1 min-w-0 pb-20 md:pb-0">{children}</main>
      <MobileNav />
    </div>
  );
}
