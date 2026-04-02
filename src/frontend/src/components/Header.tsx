import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { Bell, Moon, Sun, Zap } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

interface HeaderProps {
  walletBalance: number;
  unreadCount: number;
  username?: string;
  className?: string;
}

export default function Header({
  walletBalance,
  unreadCount,
  username,
  className,
}: HeaderProps) {
  const { isDark, toggleTheme } = useTheme();

  const initials = username ? username.slice(0, 2).toUpperCase() : "TB";

  return (
    <header
      className={cn(
        "sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border",
        className,
      )}
    >
      <div className="flex items-center justify-between h-14 px-4 max-w-screen-lg mx-auto">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2"
          data-ocid="header.link"
        >
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xs">
              BA
            </span>
          </div>
          <span className="font-bold text-lg text-gradient-green hidden sm:block">
            BGMI Arena
          </span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Wallet Balance */}
          <Link to="/wallet" data-ocid="header.wallet.link">
            <div className="flex items-center gap-1 bg-secondary/60 rounded-full px-3 py-1.5 border border-border hover:border-primary/40 transition-colors">
              <Zap className="w-3.5 h-3.5 text-yellow-400" />
              <span className="text-sm font-semibold text-foreground">
                {walletBalance.toLocaleString()}
              </span>
            </div>
          </Link>

          {/* Notifications */}
          <Link
            to="/notifications"
            className="relative"
            data-ocid="header.notifications.link"
          >
            <Button variant="ghost" size="icon" className="relative w-9 h-9">
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Button>
          </Link>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="w-9 h-9"
            data-ocid="header.theme.toggle"
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </Button>

          {/* Avatar */}
          <Link to="/profile" data-ocid="header.profile.link">
            <div className="w-8 h-8 rounded-full bg-primary/20 border-2 border-primary/40 flex items-center justify-center">
              <span className="text-primary text-xs font-bold">{initials}</span>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
