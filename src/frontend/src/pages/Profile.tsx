import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "@tanstack/react-router";
import {
  Crown,
  Edit3,
  ExternalLink,
  Save,
  Shield,
  Swords,
  Target,
  Trophy,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import BottomNav from "../components/BottomNav";
import Header from "../components/Header";
import { useGameData } from "../hooks/useGameData";

export default function Profile() {
  const game = useGameData();
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState("ThunderBolt_K");
  const [bgmiUid, setBgmiUid] = useState("3391084726");
  const [editUsername, setEditUsername] = useState(username);
  const [editUid, setEditUid] = useState(bgmiUid);

  const saveProfile = () => {
    if (!editUsername.trim()) {
      toast.error("Username cannot be empty");
      return;
    }
    setUsername(editUsername);
    setBgmiUid(editUid);
    setEditing(false);
    toast.success("Profile updated!");
  };

  const handleSubscribePremium = () => {
    if (game.isPremium) {
      toast.info("You are already a Premium member!");
      return;
    }
    const success = game.subscribePremium();
    if (success) {
      toast.success("👑 Welcome to Premium! Enjoy exclusive benefits!");
    } else {
      toast.error("Insufficient coins. You need 199 coins to subscribe.");
    }
  };

  const recentTx = game.transactions.slice(0, 5);
  const currentUserStats = {
    matchesPlayed: 23,
    wins: 15,
    kills: 344,
    coinsEarned: 1080,
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-6">
      <Header
        walletBalance={game.walletBalance}
        unreadCount={game.unreadNotificationCount}
        username={username}
      />

      <main className="max-w-screen-lg mx-auto px-4 py-4 space-y-4">
        {/* Profile Card */}
        <div className="game-card p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="w-16 h-16 border-2 border-primary">
                  <AvatarFallback className="bg-primary/20 text-primary font-bold text-xl">
                    {username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {game.isPremium && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                    <Crown className="w-3 h-3 text-yellow-900" />
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-bold text-lg text-foreground">
                    {username}
                  </h2>
                  {game.isPremium && (
                    <Badge className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 text-[10px]">
                      <Crown className="w-2.5 h-2.5 mr-0.5" /> PREMIUM
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  BGMI UID: {bgmiUid}
                </p>
                <p className="text-xs text-muted-foreground">Joined Apr 2026</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setEditing(true);
                setEditUsername(username);
                setEditUid(bgmiUid);
              }}
              className="w-8 h-8"
              data-ocid="profile.edit_button"
            >
              <Edit3 className="w-4 h-4" />
            </Button>
          </div>

          {/* Edit form */}
          {editing && (
            <div className="space-y-3 border-t border-border pt-3">
              <div className="space-y-1">
                <Label className="text-xs">Username</Label>
                <Input
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  className="h-8 text-sm"
                  data-ocid="profile.username.input"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">BGMI UID</Label>
                <Input
                  value={editUid}
                  onChange={(e) => setEditUid(e.target.value)}
                  className="h-8 text-sm"
                  data-ocid="profile.bgmi_uid.input"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="flex-1 h-8 bg-primary hover:bg-primary/90 text-primary-foreground gap-1"
                  onClick={saveProfile}
                  data-ocid="profile.save.button"
                >
                  <Save className="w-3.5 h-3.5" /> Save
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 h-8 gap-1"
                  onClick={() => setEditing(false)}
                  data-ocid="profile.cancel.button"
                >
                  <X className="w-3.5 h-3.5" /> Cancel
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {[
            {
              label: "Matches Played",
              value: currentUserStats.matchesPlayed,
              icon: <Swords className="w-4 h-4 text-blue-400" />,
            },
            {
              label: "Total Wins",
              value: currentUserStats.wins,
              icon: <Trophy className="w-4 h-4 text-yellow-400" />,
            },
            {
              label: "Total Kills",
              value: currentUserStats.kills,
              icon: <Target className="w-4 h-4 text-red-400" />,
            },
            {
              label: "Coins Earned",
              value: `${currentUserStats.coinsEarned} ⚡`,
              icon: <Zap className="w-4 h-4 text-primary" />,
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="game-card p-3 flex items-center gap-3"
            >
              <div className="w-9 h-9 bg-muted rounded-xl flex items-center justify-center flex-shrink-0">
                {stat.icon}
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className="text-base font-bold text-foreground">
                  {stat.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Premium Banner */}
        {!game.isPremium && (
          <div className="bg-gradient-to-r from-yellow-500/10 to-purple-500/10 border border-yellow-500/20 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <Crown className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-bold text-sm text-foreground mb-1">
                  Go Premium - 199 ⚡/month
                </h3>
                <ul className="text-xs text-muted-foreground space-y-0.5 mb-3">
                  <li>✓ 10% discount on all entry fees</li>
                  <li>✓ Bonus daily coins (+20 coins)</li>
                  <li>✓ Access to exclusive tournaments</li>
                </ul>
                <Button
                  size="sm"
                  className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold"
                  onClick={handleSubscribePremium}
                  data-ocid="profile.subscribe_premium.button"
                >
                  Subscribe Now
                </Button>
              </div>
            </div>
          </div>
        )}

        {game.isPremium && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-4 flex items-center gap-3">
            <Crown className="w-6 h-6 text-yellow-400" />
            <div>
              <p className="font-bold text-sm text-yellow-400">
                Premium Active 👑
              </p>
              <p className="text-xs text-muted-foreground">
                Enjoying all premium benefits
              </p>
            </div>
          </div>
        )}

        {/* Security & Admin */}
        <div className="game-card p-4 space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-sm text-foreground">Account</h3>
          </div>
          <Link to="/admin" data-ocid="profile.admin_panel.link">
            <Button
              variant="outline"
              className="w-full justify-start gap-2 text-sm"
              size="sm"
            >
              <Shield className="w-4 h-4 text-primary" />
              Admin Panel
              <ExternalLink className="w-3 h-3 ml-auto text-muted-foreground" />
            </Button>
          </Link>
        </div>

        {/* Recent Transactions */}
        <div>
          <h3 className="font-semibold text-sm text-foreground mb-3">
            Recent Transactions
          </h3>
          <div className="space-y-2">
            {recentTx.map((tx, i) => (
              <div
                key={tx.id}
                className="flex items-center gap-3 bg-card rounded-xl p-2.5 border border-border"
                data-ocid={`profile.transaction.item.${i + 1}`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center ${tx.type === "credit" ? "bg-green-500/20" : "bg-red-500/20"}`}
                >
                  <Zap
                    className={`w-3.5 h-3.5 ${tx.type === "credit" ? "text-green-400" : "text-red-400"}`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">
                    {tx.description}
                  </p>
                </div>
                <span
                  className={`text-xs font-bold ${tx.type === "credit" ? "text-green-400" : "text-red-400"}`}
                >
                  {tx.type === "credit" ? "+" : "-"}
                  {tx.amount}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
