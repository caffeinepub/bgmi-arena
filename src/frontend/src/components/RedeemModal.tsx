import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Zap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface RedeemModalProps {
  open: boolean;
  onClose: () => void;
  onRedeem: (amount: number, upiId: string) => boolean;
  walletBalance: number;
}

export default function RedeemModal({
  open,
  onClose,
  onRedeem,
  walletBalance,
}: RedeemModalProps) {
  const [amount, setAmount] = useState("");
  const [upiId, setUpiId] = useState("");

  const handleRedeem = () => {
    const coins = Number.parseInt(amount, 10);
    if (Number.isNaN(coins) || coins <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    if (coins < 100) {
      toast.error("Minimum redemption is 100 coins");
      return;
    }
    if (!upiId.trim()) {
      toast.error("Enter your UPI ID");
      return;
    }
    const success = onRedeem(coins, upiId);
    if (success) {
      toast.success("Redemption request submitted!");
      onClose();
      setAmount("");
      setUpiId("");
    } else {
      toast.error("Insufficient balance");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm mx-4" data-ocid="redeem.dialog">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            Redeem Coins
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-secondary rounded-xl p-3 border border-border">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Available Balance
              </span>
              <div className="flex items-center gap-1">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="font-bold text-foreground">
                  {walletBalance.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Amount (min 100 coins)</Label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter coin amount"
              min="100"
              max={walletBalance}
              data-ocid="redeem.amount.input"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs">UPI ID</Label>
            <Input
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="yourname@paytm"
              data-ocid="redeem.upi.input"
            />
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-yellow-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-yellow-400">
                Redemptions are processed manually. Allow 24-48 hours for
                processing. Minimum 100 coins.
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onClose}
              data-ocid="redeem.cancel.button"
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={handleRedeem}
              data-ocid="redeem.submit.button"
            >
              Redeem
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
