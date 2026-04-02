import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Ban, Eye, Search, Shield, Zap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useGameData } from "../../hooks/useGameData";
import type { AdminUser } from "../../hooks/useGameData";

export default function AdminUsers() {
  const game = useGameData();
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [coinAmount, setCoinAmount] = useState("");
  const [coinReason, setCoinReason] = useState("");
  const [showCoinModal, setShowCoinModal] = useState(false);
  const [page, setPage] = useState(1);
  const PER_PAGE = 5;

  const filtered = game.adminUsers.filter(
    (u) =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.bgmiUid.includes(search),
  );

  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);

  const handleBanToggle = (user: AdminUser) => {
    game.updateAdminUser(user.id, { isBanned: !user.isBanned });
    toast.success(
      `User ${user.isBanned ? "unbanned" : "banned"}: ${user.username}`,
    );
  };

  const handleCoinCredit = () => {
    if (!selectedUser) return;
    const amount = Number.parseInt(coinAmount);
    if (Number.isNaN(amount) || amount <= 0) {
      toast.error("Invalid amount");
      return;
    }
    if (!coinReason.trim()) {
      toast.error("Reason required");
      return;
    }
    game.adminCreditCoins(selectedUser.id, amount, coinReason);
    toast.success(`${amount} coins credited to ${selectedUser.username}`);
    setShowCoinModal(false);
    setCoinAmount("");
    setCoinReason("");
  };

  const formatDate = (d: Date) => new Date(d).toLocaleDateString();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-foreground">User Management</h1>
        <p className="text-sm text-muted-foreground">
          {game.adminUsers.length} registered users
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search by username or BGMI UID..."
          className="pl-9"
          data-ocid="admin.users.search.input"
        />
      </div>

      {/* Table */}
      <div className="game-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-3 text-xs font-semibold text-muted-foreground uppercase">
                  User
                </th>
                <th className="text-left p-3 text-xs font-semibold text-muted-foreground uppercase">
                  BGMI UID
                </th>
                <th className="text-right p-3 text-xs font-semibold text-muted-foreground uppercase">
                  Balance
                </th>
                <th className="text-center p-3 text-xs font-semibold text-muted-foreground uppercase">
                  Status
                </th>
                <th className="text-center p-3 text-xs font-semibold text-muted-foreground uppercase">
                  Joined
                </th>
                <th className="text-right p-3 text-xs font-semibold text-muted-foreground uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((user, i) => (
                <tr
                  key={user.id}
                  className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
                  data-ocid={`admin.users.row.${i + 1}`}
                >
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-7 h-7">
                        <AvatarFallback className="bg-primary/20 text-primary text-xs">
                          {user.username.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-foreground text-xs">
                          {user.username}
                        </p>
                        {user.isPremium && (
                          <Badge className="text-[9px] bg-yellow-500/20 text-yellow-400 px-1 h-4">
                            Premium
                          </Badge>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-xs font-mono text-muted-foreground">
                    {user.bgmiUid}
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Zap className="w-3 h-3 text-yellow-400" />
                      <span className="text-xs font-semibold text-foreground">
                        {user.walletBalance.toLocaleString()}
                      </span>
                    </div>
                  </td>
                  <td className="p-3 text-center">
                    <Badge
                      className={cn(
                        "text-[10px]",
                        user.isBanned
                          ? "bg-red-500/20 text-red-400 border-red-500/30"
                          : "bg-green-500/20 text-green-400 border-green-500/30",
                      )}
                    >
                      {user.isBanned ? "Banned" : "Active"}
                    </Badge>
                  </td>
                  <td className="p-3 text-center text-xs text-muted-foreground">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="p-3">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-7 h-7"
                        onClick={() => setSelectedUser(user)}
                        data-ocid={`admin.users.view.${i + 1}`}
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-7 h-7"
                        onClick={() => {
                          setSelectedUser(user);
                          setShowCoinModal(true);
                        }}
                        data-ocid={`admin.users.coins.${i + 1}`}
                      >
                        <Zap className="w-3.5 h-3.5 text-yellow-400" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                          "w-7 h-7",
                          user.isBanned
                            ? "text-green-400"
                            : "text-destructive hover:text-destructive",
                        )}
                        onClick={() => handleBanToggle(user)}
                        data-ocid={`admin.users.ban.${i + 1}`}
                      >
                        {user.isBanned ? (
                          <Shield className="w-3.5 h-3.5" />
                        ) : (
                          <Ban className="w-3.5 h-3.5" />
                        )}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 p-3 border-t border-border">
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              data-ocid="admin.users.pagination_prev"
            >
              Prev
            </Button>
            <span className="text-xs text-muted-foreground">
              {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              data-ocid="admin.users.pagination_next"
            >
              Next
            </Button>
          </div>
        )}
      </div>

      {/* User Detail Dialog */}
      {selectedUser && !showCoinModal && (
        <Dialog
          open={!!selectedUser}
          onOpenChange={() => setSelectedUser(null)}
        >
          <DialogContent data-ocid="admin.users.detail.dialog">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-primary/20 text-primary text-xs">
                    {selectedUser.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {selectedUser.username}
              </DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                { label: "BGMI UID", value: selectedUser.bgmiUid },
                { label: "Balance", value: `${selectedUser.walletBalance} ⚡` },
                { label: "Matches", value: selectedUser.matchesPlayed },
                { label: "Wins", value: selectedUser.wins },
                { label: "Kills", value: selectedUser.kills },
                { label: "Role", value: selectedUser.role },
              ].map((item) => (
                <div key={item.label} className="bg-secondary rounded-xl p-3">
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="font-bold text-foreground">{item.value}</p>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Coin Credit Dialog */}
      <Dialog open={showCoinModal} onOpenChange={setShowCoinModal}>
        <DialogContent data-ocid="admin.users.coin_credit.dialog">
          <DialogHeader>
            <DialogTitle>Credit/Debit Coins</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              User:{" "}
              <span className="font-semibold text-foreground">
                {selectedUser?.username}
              </span>
            </p>
            <div className="space-y-1">
              <Label className="text-xs">Amount (coins)</Label>
              <Input
                type="number"
                value={coinAmount}
                onChange={(e) => setCoinAmount(e.target.value)}
                placeholder="Enter amount"
                data-ocid="admin.users.coin_amount.input"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Reason</Label>
              <Input
                value={coinReason}
                onChange={(e) => setCoinReason(e.target.value)}
                placeholder="Reason for adjustment"
                data-ocid="admin.users.coin_reason.input"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowCoinModal(false)}
                data-ocid="admin.users.coin_cancel.button"
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={handleCoinCredit}
                data-ocid="admin.users.coin_credit.button"
              >
                Credit Coins
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
