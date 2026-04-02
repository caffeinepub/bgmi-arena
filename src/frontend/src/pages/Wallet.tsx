import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Gift,
  ShoppingCart,
  Zap,
} from "lucide-react";
import { useState } from "react";
import BottomNav from "../components/BottomNav";
import BuyCoinsModal from "../components/BuyCoinsModal";
import Header from "../components/Header";
import RedeemModal from "../components/RedeemModal";
import { useGameData } from "../hooks/useGameData";

export default function Wallet() {
  const game = useGameData();
  const [showBuy, setShowBuy] = useState(false);
  const [showRedeem, setShowRedeem] = useState(false);

  const formatDate = (d: Date) => {
    return new Date(d).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-6">
      <Header
        walletBalance={game.walletBalance}
        unreadCount={game.unreadNotificationCount}
        username="ThunderBolt_K"
      />

      <main className="max-w-screen-lg mx-auto px-4 py-4 space-y-5">
        {/* Balance Card */}
        <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 rounded-2xl p-6 text-center">
          <p className="text-sm text-muted-foreground mb-2">Total Balance</p>
          <div className="flex items-center justify-center gap-2 mb-4">
            <Zap className="w-8 h-8 text-yellow-400" />
            <span className="text-4xl font-bold text-foreground">
              {game.walletBalance.toLocaleString()}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mb-4">
            ≈ ₹{(game.walletBalance * 0.1).toFixed(2)} INR value
          </p>
          <div className="flex gap-3">
            <Button
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
              onClick={() => setShowBuy(true)}
              data-ocid="wallet.buy_coins.button"
            >
              <ShoppingCart className="w-4 h-4" />
              Buy Coins
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-primary/30 text-primary hover:bg-primary/10 gap-2"
              onClick={() => setShowRedeem(true)}
              data-ocid="wallet.redeem.button"
            >
              <Gift className="w-4 h-4" />
              Redeem
            </Button>
          </div>
        </div>

        {/* Transaction History */}
        <div>
          <h2 className="font-bold text-sm text-foreground uppercase tracking-wider mb-3">
            Transaction History
          </h2>

          {game.transactions.length === 0 ? (
            <div
              className="text-center py-12 text-muted-foreground"
              data-ocid="wallet.transactions.empty_state"
            >
              <Zap className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No transactions yet</p>
            </div>
          ) : (
            <ScrollArea className="h-[60vh]">
              <div className="space-y-2 pr-2">
                {game.transactions.map((tx, i) => (
                  <div
                    key={tx.id}
                    className="flex items-center gap-3 bg-card rounded-xl p-3 border border-border"
                    data-ocid={`wallet.transaction.item.${i + 1}`}
                  >
                    <div
                      className={cn(
                        "w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0",
                        tx.type === "credit"
                          ? "bg-green-500/20"
                          : "bg-red-500/20",
                      )}
                    >
                      {tx.type === "credit" ? (
                        <ArrowDownLeft className="w-4 h-4 text-green-400" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4 text-red-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {tx.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(tx.timestamp)}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p
                        className={cn(
                          "text-sm font-bold",
                          tx.type === "credit"
                            ? "text-green-400"
                            : "text-red-400",
                        )}
                      >
                        {tx.type === "credit" ? "+" : "-"}
                        {tx.amount} ⚡
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        Bal: {tx.balanceAfter.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </main>

      <BottomNav />

      <BuyCoinsModal
        open={showBuy}
        onClose={() => setShowBuy(false)}
        onBuy={game.buyCoins}
      />
      <RedeemModal
        open={showRedeem}
        onClose={() => setShowRedeem(false)}
        onRedeem={game.redeemCoins}
        walletBalance={game.walletBalance}
      />
    </div>
  );
}
