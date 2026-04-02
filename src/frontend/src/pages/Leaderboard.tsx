import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Target, Trophy, Zap } from "lucide-react";
import BottomNav from "../components/BottomNav";
import Header from "../components/Header";
import { useGameData } from "../hooks/useGameData";

export default function Leaderboard() {
  const game = useGameData();

  const top3 = game.leaderboard.slice(0, 3);
  const rest = game.leaderboard.slice(3);

  const medalBg = [
    "bg-yellow-500/20 border-yellow-500/30",
    "bg-slate-500/20 border-slate-500/30",
    "bg-orange-500/20 border-orange-500/30",
  ];
  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-6">
      <Header
        walletBalance={game.walletBalance}
        unreadCount={game.unreadNotificationCount}
        username="ThunderBolt_K"
      />

      <main className="max-w-screen-lg mx-auto px-4 py-4">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-5 h-5 text-yellow-400" />
          <h1 className="font-bold text-lg text-foreground">
            Global Leaderboard
          </h1>
        </div>

        {/* Podium Top 3 */}
        <div className="flex items-end justify-center gap-3 mb-6">
          {/* 2nd place */}
          <div
            className={cn(
              "flex flex-col items-center gap-2 p-3 rounded-2xl border flex-1 max-w-[120px]",
              medalBg[1],
            )}
          >
            <span className="text-2xl">{medals[1]}</span>
            <Avatar className="w-12 h-12 border-2 border-slate-400">
              <AvatarFallback className="bg-slate-700 text-slate-200 text-sm">
                {top3[1]?.avatar}
              </AvatarFallback>
            </Avatar>
            <p className="text-xs font-semibold text-foreground text-center line-clamp-1">
              {top3[1]?.username}
            </p>
            <div className="flex items-center gap-0.5">
              <Zap className="w-3 h-3 text-yellow-400" />
              <span className="text-xs font-bold text-yellow-400">
                {top3[1]?.coinsEarned.toLocaleString()}
              </span>
            </div>
          </div>

          {/* 1st place - bigger */}
          <div
            className={cn(
              "flex flex-col items-center gap-2 p-3 rounded-2xl border flex-1 max-w-[140px] -mt-4",
              medalBg[0],
            )}
          >
            <span className="text-3xl">{medals[0]}</span>
            <Avatar className="w-16 h-16 border-2 border-yellow-400">
              <AvatarFallback className="bg-yellow-900 text-yellow-200 font-bold">
                {top3[0]?.avatar}
              </AvatarFallback>
            </Avatar>
            <p className="text-xs font-bold text-foreground text-center line-clamp-1">
              {top3[0]?.username}
            </p>
            <div className="flex items-center gap-0.5">
              <Zap className="w-3 h-3 text-yellow-400" />
              <span className="text-xs font-bold text-yellow-400">
                {top3[0]?.coinsEarned.toLocaleString()}
              </span>
            </div>
          </div>

          {/* 3rd place */}
          <div
            className={cn(
              "flex flex-col items-center gap-2 p-3 rounded-2xl border flex-1 max-w-[120px]",
              medalBg[2],
            )}
          >
            <span className="text-2xl">{medals[2]}</span>
            <Avatar className="w-12 h-12 border-2 border-orange-400">
              <AvatarFallback className="bg-orange-900 text-orange-200 text-sm">
                {top3[2]?.avatar}
              </AvatarFallback>
            </Avatar>
            <p className="text-xs font-semibold text-foreground text-center line-clamp-1">
              {top3[2]?.username}
            </p>
            <div className="flex items-center gap-0.5">
              <Zap className="w-3 h-3 text-yellow-400" />
              <span className="text-xs font-bold text-yellow-400">
                {top3[2]?.coinsEarned.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Full list */}
        <div className="space-y-1.5">
          {/* Header row */}
          <div className="grid grid-cols-[32px_1fr_48px_48px_64px] gap-2 px-3 py-2 text-[10px] text-muted-foreground uppercase">
            <span>#</span>
            <span>Player</span>
            <span className="text-center">Wins</span>
            <span className="text-center">Kills</span>
            <span className="text-right">Coins</span>
          </div>
          {rest.map((entry, i) => (
            <div
              key={entry.userId}
              className={cn(
                "grid grid-cols-[32px_1fr_48px_48px_64px] gap-2 items-center px-3 py-2.5 rounded-xl border transition-colors",
                entry.isCurrentUser
                  ? "bg-primary/10 border-primary/30"
                  : "bg-card border-border",
              )}
              data-ocid={`leaderboard.item.${i + 1}`}
            >
              <span
                className={cn(
                  "text-sm font-bold",
                  entry.isCurrentUser
                    ? "text-primary"
                    : "text-muted-foreground",
                )}
              >
                {entry.rank}
              </span>
              <div className="flex items-center gap-2 min-w-0">
                <Avatar className="w-7 h-7 flex-shrink-0">
                  <AvatarFallback className="bg-secondary text-foreground text-[10px]">
                    {entry.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p
                    className={cn(
                      "text-xs font-semibold truncate",
                      entry.isCurrentUser && "text-primary",
                    )}
                  >
                    {entry.username}
                    {entry.isCurrentUser && " (You)"}
                  </p>
                </div>
              </div>
              <span className="text-xs text-center text-foreground font-medium">
                {entry.wins}
              </span>
              <div className="flex items-center justify-center gap-0.5">
                <Target className="w-3 h-3 text-red-400" />
                <span className="text-xs text-foreground font-medium">
                  {entry.kills}
                </span>
              </div>
              <div className="flex items-center justify-end gap-0.5">
                <Zap className="w-3 h-3 text-yellow-400" />
                <span
                  className={cn(
                    "text-xs font-bold",
                    entry.isCurrentUser ? "text-primary" : "text-yellow-400",
                  )}
                >
                  {entry.coinsEarned.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
