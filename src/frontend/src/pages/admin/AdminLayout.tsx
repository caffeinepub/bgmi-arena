import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Link,
  Outlet,
  useNavigate,
  useRouterState,
} from "@tanstack/react-router";
import {
  ChevronLeft,
  CreditCard,
  Gift,
  Image,
  LayoutDashboard,
  Medal,
  Menu,
  Moon,
  Settings,
  Shield,
  Sun,
  Target,
  Trophy,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";

const navItems = [
  { to: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/admin/tournaments", icon: Trophy, label: "Tournaments" },
  { to: "/admin/results", icon: Medal, label: "Results" },
  { to: "/admin/users", icon: Users, label: "Users" },
  { to: "/admin/redemptions", icon: CreditCard, label: "Redemptions" },
  { to: "/admin/missions", icon: Target, label: "Missions" },
  { to: "/admin/rewards", icon: Gift, label: "Rewards" },
  { to: "/admin/banners", icon: Image, label: "Banners" },
  { to: "/admin/settings", icon: Settings, label: "Settings" },
] as const;

export default function AdminLayout() {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed md:relative inset-y-0 left-0 z-50 flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300",
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          collapsed ? "w-16" : "w-60",
        )}
        data-ocid="admin.sidebar.panel"
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-14 px-3 border-b border-sidebar-border">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-sm text-sidebar-foreground">
                Admin Panel
              </span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex w-7 h-7 text-sidebar-foreground"
            data-ocid="admin.sidebar.toggle"
          >
            <ChevronLeft
              className={cn(
                "w-4 h-4 transition-transform",
                collapsed && "rotate-180",
              )}
            />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
            className="md:hidden w-7 h-7 text-sidebar-foreground"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 px-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive =
              currentPath === item.to || currentPath.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                data-ocid={`admin.nav.${item.label.toLowerCase()}.link`}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-sidebar-primary/15 text-sidebar-primary"
                    : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent",
                )}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Back to App */}
        {!collapsed && (
          <div className="p-3 border-t border-sidebar-border">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-xs text-sidebar-foreground/60 gap-2"
              onClick={() => navigate({ to: "/" })}
              data-ocid="admin.back_to_app.button"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              Back to App
            </Button>
          </div>
        )}
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-14 flex items-center justify-between px-4 border-b border-border bg-background/95 backdrop-blur-sm flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
            className="md:hidden w-9 h-9"
          >
            <Menu className="w-4 h-4" />
          </Button>
          <div className="flex-1" />
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="w-9 h-9"
            data-ocid="admin.theme.toggle"
          >
            {isDark ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </Button>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
