import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ChevronRight, Crown, Swords, Trophy, Users, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import BottomNav from "../components/BottomNav";
import BuyCoinsModal from "../components/BuyCoinsModal";
import Header from "../components/Header";
import JoinMatchModal from "../components/JoinMatchModal";
import { TournamentCardSkeleton } from "../components/LoadingSkeleton";
import TournamentCard from "../components/TournamentCard";
import { useGameData } from "../hooks/useGameData";

/** Compact promotional banner inserted between tournament cards */
function PromoBanner({
  imageUrl,
  title,
  link,
}: { imageUrl: string; title: string; link: string }) {
  return (
    <Link to={link as "/"} className="block">
      <div
        className="relative overflow-hidden rounded-2xl border border-primary/20 shadow-sm"
        data-ocid="home.promo_banner"
      >
        <div className="aspect-[8/3] overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        {/* AD label */}
        <span className="absolute top-2 right-2 text-[9px] font-semibold bg-black/50 text-white/70 px-1.5 py-0.5 rounded">
          AD
        </span>
        <div className="absolute bottom-2 left-3 right-3">
          <p className="text-white font-bold text-xs drop-shadow-lg line-clamp-1">
            {title}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  const game = useGameData();
  const [loading, setLoading] = useState(true);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [joinModal, setJoinModal] = useState<{
    open: boolean;
    roomId: string;
    roomPassword: string;
    tournamentTitle: string;
    entryFee: number;
    startTime: Date;
    isLive: boolean;
  } | null>(null);
  const [showBuyCoins, setShowBuyCoins] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Simulate loading
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  // Banner carousel
  const visibleBanners = game.banners.filter((b) => b.isVisible);
  useEffect(() => {
    if (visibleBanners.length === 0) return;
    intervalRef.current = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % visibleBanners.length);
    }, 3000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [visibleBanners.length]);

  const liveTournaments = game.tournaments
    .filter((t) => t.status === "live" || t.status === "upcoming")
    .slice(0, 5);

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
        startTime: t?.startTime || new Date(),
        isLive: t?.status === "live",
      });
      toast.success("Tournament joined successfully!");
    } else {
      toast.error(result.message);
    }
  };

  // Interleave promo banners between tournament cards (insert one after every 2 cards)
  const buildTournamentList = () => {
    const promos = visibleBanners;
    if (loading) {
      return [1, 2, 3].map((i) => <TournamentCardSkeleton key={i} />);
    }
    if (liveTournaments.length === 0) {
      return [
        <div
          key="empty"
          className="text-center py-10 text-muted-foreground"
          data-ocid="home.tournaments.empty_state"
        >
          <Trophy className="w-10 h-10 mx-auto mb-2 opacity-30" />
          <p className="text-sm">No live tournaments right now</p>
        </div>,
      ];
    }

    const items: React.ReactNode[] = [];
    let promoIndex = 0;
    liveTournaments.forEach((t, i) => {
      items.push(
        <TournamentCard
          key={t.id}
          tournament={t}
          isJoined={game.joinedTournaments.includes(t.id)}
          onJoin={handleJoin}
          index={i}
        />,
      );
      // Insert a promo banner after every 2nd card
      if ((i + 1) % 2 === 0 && promos.length > 0) {
        const promo = promos[promoIndex % promos.length];
        items.push(
          <PromoBanner
            key={`promo-${promoIndex}`}
            imageUrl={promo.imageUrl}
            title={promo.title}
            link={promo.link}
          />,
        );
        promoIndex++;
      }
    });
    return items;
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-6">
      <Header
        walletBalance={game.walletBalance}
        unreadCount={game.unreadNotificationCount}
        username="ThunderBolt_K"
      />

      <main className="max-w-screen-lg mx-auto px-4 py-4 space-y-5">
        {/* Banner Carousel */}
        <section
          className="overflow-hidden rounded-2xl"
          aria-label="Promotional banners"
        >
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentBanner * 100}%)` }}
          >
            {visibleBanners.map((banner) => (
              <Link
                key={banner.id}
                to={banner.link as "/"}
                className="flex-shrink-0 w-full relative"
              >
                <div className="aspect-[8/3] overflow-hidden rounded-2xl">
                  <img
                    src={banner.imageUrl}
                    alt={banner.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-2xl" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="text-white font-bold text-sm drop-shadow-lg line-clamp-1">
                      {banner.title}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          {/* Dot indicators */}
          <div className="flex justify-center gap-1.5 mt-2">
            {visibleBanners.map((banner, i) => (
              <button
                type="button"
                key={banner.id}
                onClick={() => setCurrentBanner(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentBanner
                    ? "w-4 bg-primary"
                    : "w-1.5 bg-muted-foreground/40"
                }`}
                aria-label={`Banner ${i + 1}`}
              />
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="grid grid-cols-3 gap-3">
          <Button
            onClick={() => setShowBuyCoins(true)}
            className="flex flex-col gap-1.5 h-auto py-3 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 border border-yellow-500/20 rounded-2xl"
            data-ocid="home.buy_coins.button"
          >
            <Zap className="w-5 h-5" />
            <span className="text-xs font-medium">Buy Coins</span>
          </Button>
          <Link to="/profile">
            <Button
              className="w-full flex flex-col gap-1.5 h-auto py-3 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20 rounded-2xl"
              data-ocid="home.go_premium.button"
            >
              <Crown className="w-5 h-5" />
              <span className="text-xs font-medium">Go Premium</span>
            </Button>
          </Link>
          <Link to="/leaderboard">
            <Button
              className="w-full flex flex-col gap-1.5 h-auto py-3 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-2xl"
              data-ocid="home.leaderboard.button"
            >
              <Trophy className="w-5 h-5" />
              <span className="text-xs font-medium">Leaderboard</span>
            </Button>
          </Link>
        </section>

        {/* Stats Row */}
        <section className="grid grid-cols-3 gap-3" aria-label="Quick stats">
          <div className="game-card p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-red-400 mb-1">
              <Swords className="w-3.5 h-3.5" />
            </div>
            <p className="text-lg font-bold text-foreground">
              {game.tournaments.filter((t) => t.status === "live").length}
            </p>
            <p className="text-[10px] text-muted-foreground">Active Matches</p>
          </div>
          <div className="game-card p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-blue-400 mb-1">
              <Users className="w-3.5 h-3.5" />
            </div>
            <p className="text-lg font-bold text-foreground">2,840</p>
            <p className="text-[10px] text-muted-foreground">Total Players</p>
          </div>
          <div className="game-card p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-yellow-400 mb-1">
              <Zap className="w-3.5 h-3.5" />
            </div>
            <p className="text-lg font-bold text-foreground">
              {game.walletBalance.toLocaleString()}
            </p>
            <p className="text-[10px] text-muted-foreground">My Balance</p>
          </div>
        </section>

        {/* Live Tournaments with interleaved promo banners */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <h2 className="font-bold text-foreground text-sm uppercase tracking-wider">
                Live Tournaments
              </h2>
            </div>
            <Link to="/tournaments" data-ocid="home.view_all.link">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-primary h-7 gap-1"
              >
                View All <ChevronRight className="w-3 h-3" />
              </Button>
            </Link>
          </div>

          <div className="space-y-3">{buildTournamentList()}</div>
        </section>

        {/* Footer */}
        <footer className="text-center py-4 text-xs text-muted-foreground border-t border-border">
          <p>
            &copy; {new Date().getFullYear()}. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </footer>
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
          startTime={joinModal.startTime}
          isLive={joinModal.isLive}
        />
      )}

      <BuyCoinsModal
        open={showBuyCoins}
        onClose={() => setShowBuyCoins(false)}
        onBuy={game.buyCoins}
      />
    </div>
  );
}
