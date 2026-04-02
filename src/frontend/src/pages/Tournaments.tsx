import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import BottomNav from "../components/BottomNav";
import Header from "../components/Header";
import JoinMatchModal from "../components/JoinMatchModal";
import TournamentCard from "../components/TournamentCard";
import { useGameData } from "../hooks/useGameData";
import type { TournamentStatus } from "../hooks/useGameData";

const FILTERS: { label: string; value: TournamentStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Live", value: "live" },
  { label: "Upcoming", value: "upcoming" },
  { label: "Completed", value: "completed" },
];

export default function Tournaments() {
  const game = useGameData();
  const [filter, setFilter] = useState<TournamentStatus | "all">("all");
  const [joinModal, setJoinModal] = useState<{
    open: boolean;
    roomId: string;
    roomPassword: string;
    tournamentTitle: string;
    entryFee: number;
  } | null>(null);

  const filtered =
    filter === "all"
      ? game.tournaments
      : game.tournaments.filter((t) => t.status === filter);

  const handleJoin = (tournamentId: string) => {
    const result = game.joinTournament(tournamentId);
    if (result.success) {
      const t = game.tournaments.find((t) => t.id === tournamentId);
      setJoinModal({
        open: true,
        roomId: result.roomId!,
        roomPassword: result.roomPassword!,
        tournamentTitle: t?.title || "",
        entryFee: t?.entryFee || 0,
      });
      toast.success("Tournament joined!");
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-6">
      <Header
        walletBalance={game.walletBalance}
        unreadCount={game.unreadNotificationCount}
        username="ThunderBolt_K"
      />

      <main className="max-w-screen-lg mx-auto px-4 py-4">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-5 h-5 text-primary" />
          <h1 className="font-bold text-lg text-foreground">Tournaments</h1>
        </div>

        <Tabs
          value={filter}
          onValueChange={(v) => setFilter(v as TournamentStatus | "all")}
          className="mb-4"
        >
          <TabsList className="w-full grid grid-cols-4">
            {FILTERS.map((f) => (
              <TabsTrigger
                key={f.value}
                value={f.value}
                data-ocid={`tournaments.${f.label.toLowerCase()}.tab`}
              >
                {f.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="space-y-3">
          {filtered.map((t, i) => (
            <TournamentCard
              key={t.id}
              tournament={t}
              isJoined={game.joinedTournaments.includes(t.id)}
              onJoin={handleJoin}
              index={i}
            />
          ))}
          {filtered.length === 0 && (
            <div
              className="text-center py-16 text-muted-foreground"
              data-ocid="tournaments.empty_state"
            >
              <Trophy className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No {filter} tournaments</p>
            </div>
          )}
        </div>
      </main>

      <BottomNav />

      {joinModal && (
        <JoinMatchModal
          open={joinModal.open}
          onClose={() => setJoinModal(null)}
          roomId={joinModal.roomId}
          roomPassword={joinModal.roomPassword}
          tournamentTitle={joinModal.tournamentTitle}
          entryFee={joinModal.entryFee}
        />
      )}
    </div>
  );
}
