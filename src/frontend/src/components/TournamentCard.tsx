import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Clock, Trophy, Users, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import type { MapType, Tournament } from "../hooks/useGameData";

const mapColors: Record<MapType, string> = {
  Erangel: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Miramar: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  Sanhok: "bg-green-500/20 text-green-400 border-green-500/30",
  Vikendi: "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

const modeColors: Record<string, string> = {
  Solo: "bg-red-500/20 text-red-400 border-red-500/30",
  Duo: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  Squad: "bg-blue-500/20 text-blue-400 border-blue-500/30",
};

function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const update = () => {
      const diff = targetDate.getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft("LIVE");
        return;
      }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      if (h > 0) setTimeLeft(`${h}h ${m}m`);
      else if (m > 0) setTimeLeft(`${m}m ${s}s`);
      else setTimeLeft(`${s}s`);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  return timeLeft;
}

interface TournamentCardProps {
  tournament: Tournament;
  isJoined: boolean;
  onJoin: (id: string) => void;
  index?: number;
  compact?: boolean;
}

export default function TournamentCard({
  tournament,
  isJoined,
  onJoin,
  index = 0,
  compact = false,
}: TournamentCardProps) {
  const countdown = useCountdown(tournament.startTime);
  const slotsPercent = (tournament.filledSlots / tournament.maxSlots) * 100;
  const slotsLeft = tournament.maxSlots - tournament.filledSlots;
  const isLive = tournament.status === "live";
  const isCompleted = tournament.status === "completed";
  const isFull = slotsLeft === 0;

  return (
    <div
      className={cn(
        "game-card-hover p-4 opacity-0 animate-fade-in",
        `animate-stagger-${Math.min(index + 1, 5)}`,
        compact && "p-3",
      )}
      data-ocid={`tournament.item.${index + 1}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex flex-wrap gap-1.5">
          <Badge className={cn("text-xs border", mapColors[tournament.map])}>
            {tournament.map}
          </Badge>
          <Badge className={cn("text-xs border", modeColors[tournament.mode])}>
            {tournament.mode}
          </Badge>
          {isLive && (
            <Badge className="text-xs bg-red-500/20 text-red-400 border-red-500/30 border animate-pulse">
              ● LIVE
            </Badge>
          )}
          {isCompleted && (
            <Badge className="text-xs bg-muted text-muted-foreground">
              Ended
            </Badge>
          )}
        </div>
        {isJoined && (
          <Badge className="text-xs bg-primary/20 text-primary border border-primary/30">
            ✓ Joined
          </Badge>
        )}
      </div>

      {/* Title */}
      <h3 className="font-semibold text-foreground text-sm mb-3 line-clamp-1">
        {tournament.title}
      </h3>

      {/* Stats row */}
      <div
        className={cn("grid grid-cols-3 gap-2 mb-3", compact && "grid-cols-3")}
      >
        <div className="flex flex-col">
          <div className="flex items-center gap-1 text-muted-foreground mb-0.5">
            <Clock className="w-3 h-3" />
            <span className="text-[10px]">Starts</span>
          </div>
          <span
            className={cn(
              "text-xs font-semibold",
              isLive ? "text-red-400" : "text-foreground",
            )}
          >
            {isLive ? "NOW" : countdown}
          </span>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1 text-muted-foreground mb-0.5">
            <Zap className="w-3 h-3" />
            <span className="text-[10px]">Entry</span>
          </div>
          <span className="text-xs font-semibold text-yellow-400">
            {tournament.entryFee} ⚡
          </span>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1 text-muted-foreground mb-0.5">
            <Trophy className="w-3 h-3" />
            <span className="text-[10px]">Prize</span>
          </div>
          <span className="text-xs font-semibold text-primary">
            {tournament.prizePool.toLocaleString()} ⚡
          </span>
        </div>
      </div>

      {/* Slots progress */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Users className="w-3 h-3" />
            <span className="text-[10px]">
              {tournament.filledSlots}/{tournament.maxSlots} slots
            </span>
          </div>
          <span
            className={cn(
              "text-[10px] font-medium",
              slotsLeft < 10 ? "text-red-400" : "text-muted-foreground",
            )}
          >
            {isFull ? "Full" : `${slotsLeft} left`}
          </span>
        </div>
        <Progress value={slotsPercent} className="h-1.5" />
      </div>

      {/* Join Button */}
      {!isCompleted && (
        <Button
          size="sm"
          className={cn(
            "w-full h-8 text-xs font-semibold transition-all duration-200",
            isJoined
              ? "bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30"
              : isFull
                ? "bg-muted text-muted-foreground cursor-not-allowed"
                : "bg-primary hover:bg-primary/90 text-primary-foreground glow-green",
          )}
          disabled={isJoined || isFull}
          onClick={() => onJoin(tournament.id)}
          data-ocid={`tournament.join_button.${index + 1}`}
        >
          {isJoined
            ? "✓ Joined"
            : isFull
              ? "Full"
              : `Join — ${tournament.entryFee} ⚡`}
        </Button>
      )}
    </div>
  );
}
