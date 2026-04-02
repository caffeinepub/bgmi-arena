import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Bell,
  CheckCheck,
  Gift,
  Shield,
  Target,
  Trophy,
  Zap,
} from "lucide-react";
import BottomNav from "../components/BottomNav";
import Header from "../components/Header";
import { useGameData } from "../hooks/useGameData";

const notifIcons: Record<string, React.ReactNode> = {
  tournament: <Trophy className="w-4 h-4 text-blue-400" />,
  coins: <Zap className="w-4 h-4 text-yellow-400" />,
  mission: <Target className="w-4 h-4 text-primary" />,
  redemption: <Gift className="w-4 h-4 text-purple-400" />,
  system: <Shield className="w-4 h-4 text-muted-foreground" />,
};

const notifBg: Record<string, string> = {
  tournament: "bg-blue-500/10",
  coins: "bg-yellow-500/10",
  mission: "bg-primary/10",
  redemption: "bg-purple-500/10",
  system: "bg-muted/50",
};

export default function Notifications() {
  const game = useGameData();

  const formatTime = (d: Date) =>
    new Date(d).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-6">
      <Header
        walletBalance={game.walletBalance}
        unreadCount={game.unreadNotificationCount}
        username="ThunderBolt_K"
      />

      <main className="max-w-screen-lg mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            <h1 className="font-bold text-lg text-foreground">Notifications</h1>
            {game.unreadNotificationCount > 0 && (
              <span className="bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {game.unreadNotificationCount}
              </span>
            )}
          </div>
          {game.unreadNotificationCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-primary h-7 gap-1"
              onClick={game.markAllNotificationsRead}
              data-ocid="notifications.mark_all_read.button"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Mark all read
            </Button>
          )}
        </div>

        <div className="space-y-2">
          {game.notifications.length === 0 ? (
            <div
              className="text-center py-16 text-muted-foreground"
              data-ocid="notifications.empty_state"
            >
              <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No notifications</p>
            </div>
          ) : (
            game.notifications.map((n, i) => (
              <div
                key={n.id}
                className={cn(
                  "flex items-start gap-3 p-3 rounded-xl border transition-all",
                  n.isRead
                    ? "bg-card border-border opacity-70"
                    : "bg-card border-border border-l-2 border-l-primary",
                )}
                data-ocid={`notifications.item.${i + 1}`}
              >
                <div
                  className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0",
                    notifBg[n.type],
                  )}
                >
                  {notifIcons[n.type]}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      "text-sm",
                      n.isRead
                        ? "text-muted-foreground"
                        : "text-foreground font-medium",
                    )}
                  >
                    {n.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatTime(n.createdAt)}
                  </p>
                </div>
                {!n.isRead && (
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                )}
              </div>
            ))
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
