import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Activity,
  CreditCard,
  TrendingUp,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import { useMemo } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useGameData } from "../../hooks/useGameData";

const activityData = [
  { time: "00:00", joins: 2 },
  { time: "03:00", joins: 1 },
  { time: "06:00", joins: 4 },
  { time: "09:00", joins: 12 },
  { time: "12:00", joins: 18 },
  { time: "15:00", joins: 24 },
  { time: "18:00", joins: 31 },
  { time: "21:00", joins: 19 },
  { time: "Now", joins: 8 },
];

export default function AdminDashboard() {
  const game = useGameData();

  const stats = useMemo(() => {
    const totalRevenue = game.transactions
      .filter((t) => t.type === "debit" && t.description.includes("Entry"))
      .reduce((sum, t) => sum + t.amount, 0);
    const pendingWithdrawals = game.redemptions.filter(
      (r) => r.status === "pending",
    ).length;
    const activeMatches = game.tournaments.filter(
      (t) => t.status === "live",
    ).length;

    return {
      totalUsers: game.adminUsers.length,
      activeMatches,
      totalRevenue,
      pendingWithdrawals,
    };
  }, [game]);

  const recentActivity = [
    ...game.notifications
      .slice(0, 8)
      .map((n) => ({ text: n.message, time: n.createdAt })),
  ].sort((a, b) => b.time.getTime() - a.time.getTime());

  const formatTime = (d: Date) =>
    new Date(d).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">BGMI Arena Overview</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Users",
            value: stats.totalUsers,
            icon: Users,
            color: "text-blue-400",
            bg: "bg-blue-500/10",
          },
          {
            label: "Active Matches",
            value: stats.activeMatches,
            icon: Trophy,
            color: "text-red-400",
            bg: "bg-red-500/10",
          },
          {
            label: "Revenue (Coins)",
            value: stats.totalRevenue.toLocaleString(),
            icon: Zap,
            color: "text-yellow-400",
            bg: "bg-yellow-500/10",
          },
          {
            label: "Pending Withdrawals",
            value: stats.pendingWithdrawals,
            icon: CreditCard,
            color: "text-purple-400",
            bg: "bg-purple-500/10",
          },
        ].map((stat, i) => (
          <Card
            key={stat.label}
            className="game-card"
            data-ocid={`admin.stat.card.${i + 1}`}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <div
                  className={`w-8 h-8 ${stat.bg} rounded-lg flex items-center justify-center`}
                >
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Activity Chart */}
        <Card className="game-card lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Tournament Joins Per Hour
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={activityData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="oklch(var(--border))"
                />
                <XAxis
                  dataKey="time"
                  tick={{
                    fontSize: 10,
                    fill: "oklch(var(--muted-foreground))",
                  }}
                />
                <YAxis
                  tick={{
                    fontSize: 10,
                    fill: "oklch(var(--muted-foreground))",
                  }}
                />
                <Tooltip
                  contentStyle={{
                    background: "oklch(var(--card))",
                    border: "1px solid oklch(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="joins"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={{ fill: "#22c55e", r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="game-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {recentActivity.slice(0, 6).map((act) => (
              <div
                key={act.text.slice(0, 20)}
                className="flex items-start gap-2 text-xs"
              >
                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-muted-foreground line-clamp-2">
                    {act.text}
                  </p>
                  <p className="text-muted-foreground/60">
                    {formatTime(act.time)}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
