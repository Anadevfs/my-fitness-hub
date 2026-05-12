import { AppSidebar, MobileNav } from "./AppSidebar";
import { useRouterState } from "@tanstack/react-router";

export function AppShell({ children }: { children: React.ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  if (path === "/login") return <>{children}</>;

  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar />
      <main className="flex-1 min-w-0 pb-20 md:pb-0">{children}</main>
      <MobileNav />
    </div>
  );
}
