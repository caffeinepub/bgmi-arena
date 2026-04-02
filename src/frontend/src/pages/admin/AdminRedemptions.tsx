import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  CheckCircle,
  CreditCard,
  XCircle,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useGameData } from "../../hooks/useGameData";
import type { RedemptionStatus } from "../../hooks/useGameData";

const STATUS_STYLES: Record<RedemptionStatus, string> = {
  pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  approved: "bg-green-500/20 text-green-400 border-green-500/30",
  rejected: "bg-red-500/20 text-red-400 border-red-500/30",
};

export default function AdminRedemptions() {
  const game = useGameData();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [action, setAction] = useState<"approve" | "reject" | null>(null);

  const selectedRequest = selectedId
    ? game.redemptions.find((r) => r.id === selectedId)
    : null;

  const handleAction = () => {
    if (!selectedId || !action) return;
    const status: RedemptionStatus =
      action === "approve" ? "approved" : "rejected";
    game.updateRedemption(selectedId, status, note);
    toast.success(`Redemption ${status}!`);
    setSelectedId(null);
    setNote("");
    setAction(null);
  };

  const pending = game.redemptions.filter((r) => r.status === "pending");
  const formatDate = (d: Date) =>
    new Date(d).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-foreground">
          Redemption Control
        </h1>
        <p className="text-sm text-muted-foreground">
          {pending.length} pending requests
        </p>
      </div>

      {/* Bulk approve */}
      {pending.length > 0 && (
        <div className="flex items-center justify-between bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3">
          <div className="flex items-center gap-2 text-sm">
            <CreditCard className="w-4 h-4 text-yellow-400" />
            <span className="text-foreground font-medium">
              {pending.length} pending withdrawal(s)
            </span>
          </div>
          <Button
            size="sm"
            className="bg-primary hover:bg-primary/90 text-primary-foreground h-7 text-xs"
            onClick={() => {
              for (const r of pending) {
                game.updateRedemption(r.id, "approved", "Bulk approved");
              }
              toast.success(`Bulk approved ${pending.length} requests`);
            }}
            data-ocid="admin.redemptions.bulk_approve.button"
          >
            Bulk Approve
          </Button>
        </div>
      )}

      {/* Requests */}
      <div className="space-y-3">
        {game.redemptions.map((req, i) => (
          <div
            key={req.id}
            className={cn(
              "game-card p-4",
              req.isFlagged && "border-red-500/40 bg-red-500/5",
            )}
            data-ocid={`admin.redemptions.item.${i + 1}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-sm text-foreground">
                    {req.username}
                  </p>
                  <Badge
                    className={cn("text-xs border", STATUS_STYLES[req.status])}
                  >
                    {req.status}
                  </Badge>
                  {req.isFlagged && (
                    <Badge className="text-xs bg-red-500/20 text-red-400 border border-red-500/30 gap-1">
                      <AlertTriangle className="w-2.5 h-2.5" />
                      Flagged
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Zap className="w-3 h-3 text-yellow-400" />
                    <span className="text-yellow-400 font-semibold">
                      {req.amount} coins
                    </span>
                  </div>
                  <span>UPI: {req.upiId}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDate(req.requestedAt)}
                </p>
                {req.adminNote && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Note: {req.adminNote}
                  </p>
                )}
              </div>
              {req.status === "pending" && (
                <div className="flex gap-1.5 flex-shrink-0">
                  <Button
                    size="sm"
                    className="h-8 bg-primary hover:bg-primary/90 text-primary-foreground gap-1 text-xs"
                    onClick={() => {
                      setSelectedId(req.id);
                      setAction("approve");
                    }}
                    data-ocid={`admin.redemptions.approve.${i + 1}`}
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-destructive border-destructive/30 hover:bg-destructive/10 gap-1 text-xs"
                    onClick={() => {
                      setSelectedId(req.id);
                      setAction("reject");
                    }}
                    data-ocid={`admin.redemptions.reject.${i + 1}`}
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    Reject
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}

        {game.redemptions.length === 0 && (
          <div
            className="text-center py-12 text-muted-foreground"
            data-ocid="admin.redemptions.empty_state"
          >
            <CreditCard className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p>No redemption requests</p>
          </div>
        )}
      </div>

      {/* Action Dialog */}
      <Dialog
        open={!!selectedId && !!action}
        onOpenChange={() => {
          setSelectedId(null);
          setAction(null);
        }}
      >
        <DialogContent data-ocid="admin.redemptions.action.dialog">
          <DialogHeader>
            <DialogTitle>
              {action === "approve" ? "Approve" : "Reject"} Redemption
            </DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-3">
              <div className="bg-secondary rounded-xl p-3">
                <p className="text-sm font-medium text-foreground">
                  {selectedRequest.username}
                </p>
                <div className="flex items-center gap-1 text-yellow-400">
                  <Zap className="w-3.5 h-3.5" />
                  <span className="font-bold">
                    {selectedRequest.amount} coins
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  UPI: {selectedRequest.upiId}
                </p>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Admin Note (optional)</Label>
                <Textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Add a note..."
                  rows={2}
                  data-ocid="admin.redemptions.note.textarea"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setSelectedId(null);
                    setAction(null);
                  }}
                  data-ocid="admin.redemptions.cancel.button"
                >
                  Cancel
                </Button>
                <Button
                  className={cn(
                    "flex-1",
                    action === "approve"
                      ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                      : "bg-destructive hover:bg-destructive/90 text-destructive-foreground",
                  )}
                  onClick={handleAction}
                  data-ocid="admin.redemptions.confirm.button"
                >
                  {action === "approve" ? "Approve" : "Reject"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
