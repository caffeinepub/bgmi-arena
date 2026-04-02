import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, Smartphone, Zap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const COIN_PACKAGES = [
  { coins: 100, price: 10, bonus: 0 },
  { coins: 300, price: 25, bonus: 30 },
  { coins: 500, price: 40, bonus: 75 },
  { coins: 1000, price: 75, bonus: 200 },
];

interface BuyCoinsModalProps {
  open: boolean;
  onClose: () => void;
  onBuy: (amount: number) => void;
}

export default function BuyCoinsModal({
  open,
  onClose,
  onBuy,
}: BuyCoinsModalProps) {
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [upiId, setUpiId] = useState("");
  const [step, setStep] = useState<"select" | "payment" | "success">("select");

  const handleContinue = () => {
    if (selectedPackage === null) {
      toast.error("Please select a coin package");
      return;
    }
    setStep("payment");
  };

  const handlePay = () => {
    if (!upiId.trim()) {
      toast.error("Please enter your UPI ID");
      return;
    }
    const pkg = COIN_PACKAGES[selectedPackage!];
    const total = pkg.coins + pkg.bonus;
    onBuy(total);
    setStep("success");
    setTimeout(() => {
      onClose();
      setStep("select");
      setSelectedPackage(null);
      setUpiId("");
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm mx-4" data-ocid="buy_coins.dialog">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-400" />
            Buy Coins
          </DialogTitle>
        </DialogHeader>

        {step === "select" && (
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground">
              Select a coin package
            </p>
            <div className="grid grid-cols-2 gap-2">
              {COIN_PACKAGES.map((pkg, i) => (
                <button
                  type="button"
                  key={pkg.coins}
                  onClick={() => setSelectedPackage(i)}
                  data-ocid={`buy_coins.package.${i + 1}`}
                  className={`p-3 rounded-xl border text-left transition-all duration-200 ${
                    selectedPackage === i
                      ? "border-primary bg-primary/10"
                      : "border-border bg-card hover:border-primary/40"
                  }`}
                >
                  <div className="flex items-center gap-1 mb-1">
                    <Zap className="w-3 h-3 text-yellow-400" />
                    <span className="font-bold text-sm text-foreground">
                      {pkg.coins}
                    </span>
                  </div>
                  {pkg.bonus > 0 && (
                    <div className="text-[10px] text-primary mb-1">
                      +{pkg.bonus} bonus!
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground">
                    ₹{pkg.price}
                  </div>
                </button>
              ))}
            </div>
            <Button
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={handleContinue}
              data-ocid="buy_coins.continue.button"
            >
              Continue
            </Button>
          </div>
        )}

        {step === "payment" && (
          <div className="space-y-4">
            <div className="bg-primary/10 border border-primary/20 rounded-xl p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Total Coins
                </span>
                <div className="flex items-center gap-1">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span className="font-bold text-foreground">
                    {COIN_PACKAGES[selectedPackage!].coins +
                      COIN_PACKAGES[selectedPackage!].bonus}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-sm text-muted-foreground">Amount</span>
                <span className="font-bold text-primary">
                  ₹{COIN_PACKAGES[selectedPackage!].price}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs">UPI ID</Label>
              <div className="relative">
                <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="yourname@paytm"
                  className="pl-9"
                  data-ocid="buy_coins.upi.input"
                />
              </div>
            </div>

            <div className="bg-secondary rounded-xl p-3 border border-border">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <CreditCard className="w-3 h-3" />
                <span>
                  Payment will be verified manually. Coins credited within 5
                  minutes.
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setStep("select")}
                data-ocid="buy_coins.back.button"
              >
                Back
              </Button>
              <Button
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={handlePay}
                data-ocid="buy_coins.pay.button"
              >
                Pay ₹{COIN_PACKAGES[selectedPackage!].price}
              </Button>
            </div>
          </div>
        )}

        {step === "success" && (
          <div className="text-center py-4 space-y-3">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
              <Zap className="w-8 h-8 text-primary" />
            </div>
            <p className="font-semibold text-foreground">Payment Submitted!</p>
            <p className="text-sm text-muted-foreground">
              Coins will be credited after verification.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
