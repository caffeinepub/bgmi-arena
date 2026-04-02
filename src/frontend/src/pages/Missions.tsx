import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  Calendar,
  CheckCircle,
  Clock,
  Play,
  Swords,
  Target,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import BottomNav from "../components/BottomNav";
import Header from "../components/Header";
import { useGameData } from "../hooks/useGameData";
import type { Mission } from "../hooks/useGameData";

const missionIcons: Record<string, React.ReactNode> = {
  daily_login: <Calendar className="w-5 h-5" />,
  watch_ad: <Play className="w-5 h-5" />,
  play_match: <Swords className="w-5 h-5" />,
  custom: <Target className="w-5 h-5" />,
};

const missionColors: Record<string, string> = {
  daily_login: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  watch_ad: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  play_match: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  custom: "bg-primary/20 text-primary border-primary/30",
};

interface MissionCardProps {
  mission: Mission;
  isCompleted: boolean;
  canClaim: boolean;
  onClaim: () => void;
  index: number;
}

function WatchAdButton({ onClaim }: { onClaim: () => void }) {
  const [countdown, setCountdown] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startAd = () => {
    setCountdown(30);
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          if (prev === 1) {
            setTimeout(onClaim, 100);
          }
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  if (countdown !== null) {
    return (
      <Button
        size="sm"
        variant="outline"
        disabled
        className="h-8 min-w-[100px] border-primary/30"
        data-ocid="missions.watch_ad.button"
      >
        <Clock className="w-3.5 h-3.5 mr-1" />
        Ad ends in {countdown}s
      </Button>
    );
  }

  return (
    <Button
      size="sm"
      className="h-8 bg-primary hover:bg-primary/90 text-primary-foreground"
      onClick={startAd}
      data-ocid="missions.watch_ad.button"
    >
      <Play className="w-3.5 h-3.5 mr-1" />
      Watch Ad
    </Button>
  );
}

function MissionCard({
  mission,
  isCompleted,
  canClaim,
  onClaim,
  index,
}: MissionCardProps) {
  const icon = missionIcons[mission.type] || missionIcons.custom;
  const colorClass = missionColors[mission.type] || missionColors.custom;
  const hasProgress = mission.maxProgress && mission.maxProgress > 0;
  const progressValue = hasProgress
    ? Math.min(((mission.progress || 0) / mission.maxProgress!) * 100, 100)
    : 0;
  const isProgressComplete =
    hasProgress && (mission.progress || 0) >= mission.maxProgress!;

  return (
    <div
      className={cn(
        "game-card p-4 opacity-0 animate-fade-in",
        `animate-stagger-${Math.min(index + 1, 5)}`,
        isCompleted && "opacity-70",
      )}
      data-ocid={`missions.item.${index + 1}`}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0",
            colorClass,
          )}
        >
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-sm text-foreground">
              {mission.name}
            </h3>
            {isCompleted && (
              <Badge className="text-[10px] bg-primary/20 text-primary border border-primary/20 px-1.5">
                ✓ Done
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground mb-2">
            {mission.description}
          </p>
          {hasProgress && (
            <div className="mb-2">
              <div className="flex justify-between mb-1">
                <span className="text-[10px] text-muted-foreground">
                  Progress:{" "}
                  {Math.min(mission.progress || 0, mission.maxProgress!)} /{" "}
                  {mission.maxProgress}
                </span>
              </div>
              <Progress value={progressValue} className="h-1.5" />
            </div>
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-yellow-400" />
              <span className="text-sm font-bold text-yellow-400">
                +{mission.rewardCoins}
              </span>
            </div>
            {isCompleted || isProgressComplete ? (
              <CheckCircle className="w-5 h-5 text-primary" />
            ) : mission.type === "watch_ad" ? (
              <WatchAdButton onClaim={onClaim} />
            ) : canClaim ? (
              <Button
                size="sm"
                className="h-8 bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={onClaim}
                data-ocid={`missions.claim.button.${index + 1}`}
              >
                Claim
              </Button>
            ) : (
              <Button size="sm" variant="outline" disabled className="h-8">
                Pending
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Missions() {
  const game = useGameData();

  const handleClaim = (missionId: string) => {
    if (missionId === "m1") {
      const success = game.claimDailyLogin();
      if (success) {
        toast.success("✅ Daily Login claimed! +10 coins");
      } else {
        toast.info("Already claimed today. Come back tomorrow!");
      }
    } else if (missionId === "m2") {
      game.claimWatchAd();
      toast.success("🎮 Watch Ad complete! +10 coins");
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-6">
      <Header
        walletBalance={game.walletBalance}
        unreadCount={game.unreadNotificationCount}
        username="ThunderBolt_K"
      />

      <main className="max-w-screen-lg mx-auto px-4 py-4 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Target className="w-5 h-5 text-primary" />
          <h1 className="font-bold text-lg text-foreground">Daily Missions</h1>
        </div>

        {/* Earnings summary */}
        <div className="bg-primary/10 border border-primary/20 rounded-2xl p-3 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Missions Completed</p>
            <p className="text-lg font-bold text-foreground">
              {game.completedMissions.length} / {game.missions.length}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Max Earnings Today</p>
            <div className="flex items-center gap-1 justify-end">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-lg font-bold text-yellow-400">
                {game.missions
                  .filter((m) => m.isActive)
                  .reduce((sum, m) => sum + m.rewardCoins, 0)}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {game.missions
            .filter((m) => m.isActive)
            .map((mission, i) => (
              <MissionCard
                key={mission.id}
                mission={mission}
                isCompleted={game.completedMissions.includes(mission.id)}
                canClaim={
                  mission.type === "daily_login"
                    ? game.canClaimDailyLogin
                    : mission.type === "watch_ad"
                }
                onClaim={() => handleClaim(mission.id)}
                index={i}
              />
            ))}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
