import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle, Clock, Copy, Lock, Shield, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const REVEAL_MINUTES = 15;

interface JoinMatchModalProps {
  open: boolean;
  onClose: () => void;
  roomId: string;
  roomPassword: string;
  tournamentTitle: string;
  entryFee: number;
  startTime?: Date;
  isLive?: boolean;
}

function computeReveal(
  startTime: Date | undefined,
  isLive: boolean | undefined,
): { unlocked: boolean; countdown: string } {
  if (isLive) return { unlocked: true, countdown: "" };
  if (!startTime) return { unlocked: true, countdown: "" };
  const diff = startTime.getTime() - Date.now();
  if (diff <= REVEAL_MINUTES * 60 * 1000)
    return { unlocked: true, countdown: "" };
  const totalSec = Math.floor(diff / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  let str = "";
  if (h > 0) str = `${h}h ${m}m ${s}s`;
  else if (m > 0) str = `${m}m ${s}s`;
  else str = `${s}s`;
  return { unlocked: false, countdown: str };
}

function useRoomReveal(startTime?: Date, isLive?: boolean) {
  const [revealState, setRevealState] = useState(() =>
    computeReveal(startTime, isLive),
  );

  useEffect(() => {
    const tick = () => {
      const next = computeReveal(startTime, isLive);
      setRevealState(next);
      return next.unlocked;
    };
    if (tick()) return;
    const id = setInterval(() => {
      if (tick()) clearInterval(id);
    }, 1000);
    return () => clearInterval(id);
  }, [startTime, isLive]);

  return revealState;
}

export default function JoinMatchModal({
  open,
  onClose,
  roomId,
  roomPassword,
  tournamentTitle,
  entryFee,
  startTime,
  isLive,
}: JoinMatchModalProps) {
  const [copiedRoom, setCopiedRoom] = useState(false);
  const [copiedPass, setCopiedPass] = useState(false);
  const { unlocked, countdown } = useRoomReveal(startTime, isLive);

  const copyText = (text: string, type: "room" | "pass") => {
    navigator.clipboard.writeText(text);
    if (type === "room") {
      setCopiedRoom(true);
      setTimeout(() => setCopiedRoom(false), 2000);
    } else {
      setCopiedPass(true);
      setTimeout(() => setCopiedPass(false), 2000);
    }
    toast.success("Copied to clipboard!");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm mx-4" data-ocid="join_match.dialog">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-primary" />
            </div>
            <DialogTitle className="text-base">Match Joined!</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-primary/10 border border-primary/20 rounded-xl p-3">
            <p className="text-xs text-muted-foreground mb-1">Tournament</p>
            <p className="text-sm font-semibold text-foreground">
              {tournamentTitle}
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span>
              <span className="text-yellow-400 font-semibold">
                {entryFee} coins
              </span>{" "}
              deducted from wallet
            </span>
          </div>

          {unlocked ? (
            <div className="space-y-3">
              <div className="bg-secondary rounded-xl p-3 border border-border">
                <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                  <Shield className="w-3 h-3" /> Room ID
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold font-mono text-primary">
                    {roomId}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => copyText(roomId, "room")}
                    data-ocid="join_match.copy_room.button"
                  >
                    {copiedRoom ? (
                      <CheckCircle className="w-3 h-3 text-primary" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="bg-secondary rounded-xl p-3 border border-border">
                <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                  <Shield className="w-3 h-3" /> Password
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold font-mono text-foreground">
                    {roomPassword}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => copyText(roomPassword, "pass")}
                    data-ocid="join_match.copy_password.button"
                  >
                    {copiedPass ? (
                      <CheckCircle className="w-3 h-3 text-primary" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </Button>
                </div>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                Share these details with your squad. Good luck! 🎮
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="bg-secondary rounded-xl p-4 border border-border flex flex-col items-center gap-3 text-center">
                <div className="w-12 h-12 rounded-full bg-yellow-500/15 border border-yellow-500/30 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Room Details Locked
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Shared by admin {REVEAL_MINUTES} minutes before match
                  </p>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-4 py-2.5 w-full">
                  <div className="flex items-center justify-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-yellow-400" />
                    <span className="text-xs text-muted-foreground">
                      Reveals in
                    </span>
                  </div>
                  <p className="text-xl font-bold font-mono text-yellow-400 mt-0.5">
                    {countdown}
                  </p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Come back {REVEAL_MINUTES} min before match start to see Room ID
                &amp; Password.
              </p>
            </div>
          )}

          <Button
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={onClose}
            data-ocid="join_match.close.button"
          >
            {unlocked ? "Got it! Let's Go!" : "OK, Remind Me!"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
