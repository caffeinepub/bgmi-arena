import { useCallback, useEffect, useState } from "react";

// ===== TYPES =====
export type MapType = "Erangel" | "Miramar" | "Sanhok" | "Vikendi";
export type TournamentMode = "Solo" | "Duo" | "Squad";
export type TournamentStatus = "upcoming" | "live" | "completed";
export type TransactionType = "credit" | "debit";
export type MissionType = "daily_login" | "watch_ad" | "play_match" | "custom";
export type RedemptionStatus = "pending" | "approved" | "rejected";

export interface Tournament {
  id: string;
  title: string;
  map: MapType;
  mode: TournamentMode;
  entryFee: number;
  prizePool: number;
  startTime: Date;
  maxSlots: number;
  filledSlots: number;
  roomId: string;
  roomPassword: string;
  status: TournamentStatus;
  description: string;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  timestamp: Date;
  balanceBefore: number;
  balanceAfter: number;
}

export interface Mission {
  id: string;
  name: string;
  description: string;
  type: MissionType;
  rewardCoins: number;
  isActive: boolean;
  progress?: number;
  maxProgress?: number;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  avatar: string;
  wins: number;
  kills: number;
  coinsEarned: number;
  isCurrentUser?: boolean;
}

export interface Notification {
  id: string;
  message: string;
  type: "tournament" | "coins" | "mission" | "redemption" | "system";
  isRead: boolean;
  createdAt: Date;
}

export interface Banner {
  id: string;
  imageUrl: string;
  title: string;
  link: string;
  isVisible: boolean;
  order: number;
}

export interface RedemptionRequest {
  id: string;
  userId: string;
  username: string;
  amount: number;
  upiId: string;
  status: RedemptionStatus;
  requestedAt: Date;
  resolvedAt?: Date;
  adminNote?: string;
  isFlagged?: boolean;
}

export interface AdminUser {
  id: string;
  username: string;
  bgmiUid: string;
  walletBalance: number;
  isBanned: boolean;
  isPremium: boolean;
  role: "admin" | "user";
  createdAt: Date;
  matchesPlayed: number;
  wins: number;
  kills: number;
}

export interface Result {
  id: string;
  tournamentId: string;
  tournamentTitle: string;
  rank: number;
  kills: number;
  points: number;
  prizeAwarded: number;
  publishedAt: Date;
}

// ===== INITIAL MOCK DATA =====
const now = new Date();

const initialTournaments: Tournament[] = [
  {
    id: "t1",
    title: "Erangel Classic - Pro League",
    map: "Erangel",
    mode: "Squad",
    entryFee: 50,
    prizePool: 5000,
    startTime: new Date(now.getTime() + 2 * 60 * 60 * 1000),
    maxSlots: 100,
    filledSlots: 76,
    roomId: "BGMI-7842",
    roomPassword: "arena123",
    status: "upcoming",
    description:
      "Classic 100-player squad battle on Erangel. Top 10 get prizes!",
  },
  {
    id: "t2",
    title: "Miramar Desert Storm",
    map: "Miramar",
    mode: "Solo",
    entryFee: 30,
    prizePool: 2000,
    startTime: new Date(now.getTime() - 15 * 60 * 1000),
    maxSlots: 100,
    filledSlots: 98,
    roomId: "BGMI-3391",
    roomPassword: "storm456",
    status: "live",
    description: "Solo glory on the deserts of Miramar. Winner takes all!",
  },
  {
    id: "t3",
    title: "Sanhok TDM Showdown",
    map: "Sanhok",
    mode: "Duo",
    entryFee: 20,
    prizePool: 1000,
    startTime: new Date(now.getTime() + 45 * 60 * 1000),
    maxSlots: 50,
    filledSlots: 32,
    roomId: "BGMI-5517",
    roomPassword: "duo789",
    status: "upcoming",
    description: "Fast-paced Duo battles in the jungle of Sanhok.",
  },
  {
    id: "t4",
    title: "Vikendi Winter Clash",
    map: "Vikendi",
    mode: "Squad",
    entryFee: 100,
    prizePool: 10000,
    startTime: new Date(now.getTime() + 24 * 60 * 60 * 1000),
    maxSlots: 100,
    filledSlots: 44,
    roomId: "BGMI-9901",
    roomPassword: "winter321",
    status: "upcoming",
    description: "Premium squad tournament on Vikendi. Massive prize pool!",
  },
  {
    id: "t5",
    title: "Erangel Solo Blitz",
    map: "Erangel",
    mode: "Solo",
    entryFee: 15,
    prizePool: 800,
    startTime: new Date(now.getTime() - 3 * 60 * 60 * 1000),
    maxSlots: 100,
    filledSlots: 100,
    roomId: "BGMI-1122",
    roomPassword: "blitz999",
    status: "completed",
    description: "Intense solo battle on Erangel.",
  },
  {
    id: "t6",
    title: "Sanhok Classic - Rush Hour",
    map: "Sanhok",
    mode: "Squad",
    entryFee: 40,
    prizePool: 3500,
    startTime: new Date(now.getTime() + 5 * 60 * 60 * 1000),
    maxSlots: 80,
    filledSlots: 55,
    roomId: "BGMI-6634",
    roomPassword: "rush555",
    status: "upcoming",
    description: "Squad battle in the dense Sanhok jungle.",
  },
  {
    id: "t7",
    title: "Miramar Duo Championship",
    map: "Miramar",
    mode: "Duo",
    entryFee: 25,
    prizePool: 1500,
    startTime: new Date(now.getTime() - 2 * 60 * 60 * 1000),
    maxSlots: 50,
    filledSlots: 50,
    roomId: "BGMI-7753",
    roomPassword: "champ777",
    status: "completed",
    description: "Championship duo battle on Miramar.",
  },
  {
    id: "t8",
    title: "Vikendi Premium Solo",
    map: "Vikendi",
    mode: "Solo",
    entryFee: 75,
    prizePool: 7500,
    startTime: new Date(now.getTime() + 12 * 60 * 60 * 1000),
    maxSlots: 100,
    filledSlots: 23,
    roomId: "BGMI-8890",
    roomPassword: "prem001",
    status: "upcoming",
    description: "Premium solo tournament for serious players.",
  },
];

const initialTransactions: Transaction[] = [
  {
    id: "tx1",
    type: "credit",
    amount: 500,
    description: "Welcome Bonus",
    timestamp: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
    balanceBefore: 0,
    balanceAfter: 500,
  },
  {
    id: "tx2",
    type: "debit",
    amount: 50,
    description: "Tournament Entry: Erangel Classic",
    timestamp: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000),
    balanceBefore: 500,
    balanceAfter: 450,
  },
  {
    id: "tx3",
    type: "credit",
    amount: 200,
    description: "Tournament Prize: Erangel Classic (Rank 3)",
    timestamp: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
    balanceBefore: 450,
    balanceAfter: 650,
  },
  {
    id: "tx4",
    type: "credit",
    amount: 10,
    description: "Daily Login Reward",
    timestamp: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
    balanceBefore: 650,
    balanceAfter: 660,
  },
  {
    id: "tx5",
    type: "debit",
    amount: 30,
    description: "Tournament Entry: Miramar Desert Storm",
    timestamp: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
    balanceBefore: 660,
    balanceAfter: 630,
  },
  {
    id: "tx6",
    type: "credit",
    amount: 10,
    description: "Watch Ad Reward",
    timestamp: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
    balanceBefore: 630,
    balanceAfter: 640,
  },
  {
    id: "tx7",
    type: "credit",
    amount: 300,
    description: "Coins Purchase (UPI)",
    timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
    balanceBefore: 640,
    balanceAfter: 940,
  },
  {
    id: "tx8",
    type: "debit",
    amount: 20,
    description: "Tournament Entry: Sanhok TDM",
    timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
    balanceBefore: 940,
    balanceAfter: 920,
  },
  {
    id: "tx9",
    type: "credit",
    amount: 10,
    description: "Daily Login Reward",
    timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000),
    balanceBefore: 920,
    balanceAfter: 930,
  },
  {
    id: "tx10",
    type: "credit",
    amount: 150,
    description: "Tournament Prize: Sanhok TDM (Rank 5)",
    timestamp: new Date(now.getTime() - 12 * 60 * 60 * 1000),
    balanceBefore: 930,
    balanceAfter: 1080,
  },
];

const initialMissions: Mission[] = [
  {
    id: "m1",
    name: "Daily Login",
    description: "Login every day to claim your reward",
    type: "daily_login",
    rewardCoins: 10,
    isActive: true,
  },
  {
    id: "m2",
    name: "Watch an Ad",
    description: "Watch a 30-second ad to earn coins",
    type: "watch_ad",
    rewardCoins: 10,
    isActive: true,
  },
  {
    id: "m3",
    name: "Play a Match",
    description: "Participate in any tournament to earn bonus coins",
    type: "play_match",
    rewardCoins: 25,
    isActive: true,
    progress: 0,
    maxProgress: 1,
  },
  {
    id: "m4",
    name: "First Win",
    description: "Win your first tournament match",
    type: "custom",
    rewardCoins: 100,
    isActive: true,
    progress: 0,
    maxProgress: 1,
  },
  {
    id: "m5",
    name: "Coin Collector",
    description: "Accumulate 1000 coins total",
    type: "custom",
    rewardCoins: 50,
    isActive: true,
    progress: 1080,
    maxProgress: 1000,
  },
];

const initialLeaderboard: LeaderboardEntry[] = [
  {
    rank: 1,
    userId: "u_shadow",
    username: "ShadowKiller_X",
    avatar: "SK",
    wins: 47,
    kills: 892,
    coinsEarned: 25400,
  },
  {
    rank: 2,
    userId: "u_fury",
    username: "ProFury99",
    avatar: "PF",
    wins: 42,
    kills: 751,
    coinsEarned: 22100,
  },
  {
    rank: 3,
    userId: "u_storm",
    username: "StormRider",
    avatar: "SR",
    wins: 39,
    kills: 698,
    coinsEarned: 20800,
  },
  {
    rank: 4,
    userId: "u_ninja",
    username: "NinjaAssassin",
    avatar: "NA",
    wins: 35,
    kills: 634,
    coinsEarned: 18500,
  },
  {
    rank: 5,
    userId: "u_blaze",
    username: "BlazeWarrior",
    avatar: "BW",
    wins: 31,
    kills: 589,
    coinsEarned: 16200,
  },
  {
    rank: 6,
    userId: "u_viper",
    username: "ViperStrike",
    avatar: "VS",
    wins: 28,
    kills: 521,
    coinsEarned: 14800,
  },
  {
    rank: 7,
    userId: "u_dragon",
    username: "DragonSlayer07",
    avatar: "DS",
    wins: 24,
    kills: 477,
    coinsEarned: 12600,
  },
  {
    rank: 8,
    userId: "u_ghost",
    username: "GhostRecon_IND",
    avatar: "GR",
    wins: 21,
    kills: 423,
    coinsEarned: 11200,
  },
  {
    rank: 9,
    userId: "u_ace",
    username: "AceCommando",
    avatar: "AC",
    wins: 18,
    kills: 389,
    coinsEarned: 9800,
  },
  {
    rank: 10,
    userId: "u_thunder",
    username: "ThunderBolt_K",
    avatar: "TB",
    wins: 15,
    kills: 344,
    coinsEarned: 8400,
    isCurrentUser: true,
  },
  {
    rank: 11,
    userId: "u_hawk",
    username: "HawkEye_Pro",
    avatar: "HE",
    wins: 13,
    kills: 312,
    coinsEarned: 7200,
  },
  {
    rank: 12,
    userId: "u_sniper",
    username: "SniperElite_X",
    avatar: "SE",
    wins: 11,
    kills: 289,
    coinsEarned: 6100,
  },
  {
    rank: 13,
    userId: "u_cobra",
    username: "CobraCommander",
    avatar: "CC",
    wins: 9,
    kills: 254,
    coinsEarned: 5200,
  },
  {
    rank: 14,
    userId: "u_wolf",
    username: "WolfPack_Alpha",
    avatar: "WP",
    wins: 7,
    kills: 221,
    coinsEarned: 4300,
  },
  {
    rank: 15,
    userId: "u_eagle",
    username: "EagleEyes99",
    avatar: "EE",
    wins: 6,
    kills: 198,
    coinsEarned: 3600,
  },
  {
    rank: 16,
    userId: "u_phantom",
    username: "PhantomGamer",
    avatar: "PG",
    wins: 5,
    kills: 167,
    coinsEarned: 2900,
  },
  {
    rank: 17,
    userId: "u_rapid",
    username: "RapidFire_IND",
    avatar: "RF",
    wins: 4,
    kills: 143,
    coinsEarned: 2400,
  },
  {
    rank: 18,
    userId: "u_titan",
    username: "TitanGrip_X",
    avatar: "TG",
    wins: 3,
    kills: 118,
    coinsEarned: 1900,
  },
  {
    rank: 19,
    userId: "u_apex",
    username: "ApexPredator",
    avatar: "AP",
    wins: 2,
    kills: 89,
    coinsEarned: 1400,
  },
  {
    rank: 20,
    userId: "u_nova",
    username: "NovaStar_Gaming",
    avatar: "NS",
    wins: 1,
    kills: 56,
    coinsEarned: 900,
  },
];

const initialNotifications: Notification[] = [
  {
    id: "n1",
    message: "You joined Erangel Classic - Pro League! Room: BGMI-7842",
    type: "tournament",
    isRead: false,
    createdAt: new Date(now.getTime() - 10 * 60 * 1000),
  },
  {
    id: "n2",
    message: "🏆 Result Posted: Miramar Desert Storm - You ranked #5!",
    type: "tournament",
    isRead: false,
    createdAt: new Date(now.getTime() - 30 * 60 * 1000),
  },
  {
    id: "n3",
    message: "⚡ 150 coins credited for tournament prize!",
    type: "coins",
    isRead: false,
    createdAt: new Date(now.getTime() - 45 * 60 * 1000),
  },
  {
    id: "n4",
    message: "✅ Daily Login mission completed! +10 coins",
    type: "mission",
    isRead: true,
    createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
  },
  {
    id: "n5",
    message: "Your redemption request of 500 coins has been approved!",
    type: "redemption",
    isRead: true,
    createdAt: new Date(now.getTime() - 5 * 60 * 60 * 1000),
  },
  {
    id: "n6",
    message:
      "New tournament added: Vikendi Winter Clash - Prize Pool 10,000 coins!",
    type: "tournament",
    isRead: true,
    createdAt: new Date(now.getTime() - 24 * 60 * 60 * 1000),
  },
  {
    id: "n7",
    message: "🎯 Watch Ad mission completed! +10 coins",
    type: "mission",
    isRead: true,
    createdAt: new Date(now.getTime() - 25 * 60 * 60 * 1000),
  },
  {
    id: "n8",
    message: "Welcome to BGMI Arena! Start your journey with 500 bonus coins.",
    type: "system",
    isRead: true,
    createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: "n9",
    message: "Sanhok TDM Showdown starts in 45 minutes. Get ready!",
    type: "tournament",
    isRead: false,
    createdAt: new Date(now.getTime() - 5 * 60 * 1000),
  },
  {
    id: "n10",
    message: "Your buy coins request of 300 coins has been credited.",
    type: "coins",
    isRead: true,
    createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
  },
];

const initialBanners: Banner[] = [
  {
    id: "b1",
    imageUrl: "/assets/generated/bgmi-banner-1.dim_800x300.jpg",
    title: "Erangel Classic Pro League",
    link: "/tournaments",
    isVisible: true,
    order: 1,
  },
  {
    id: "b2",
    imageUrl: "/assets/generated/bgmi-banner-2.dim_800x300.jpg",
    title: "Miramar Desert Storm",
    link: "/tournaments",
    isVisible: true,
    order: 2,
  },
  {
    id: "b3",
    imageUrl: "/assets/generated/bgmi-banner-premium.dim_800x300.jpg",
    title: "Go Premium Today",
    link: "/profile",
    isVisible: true,
    order: 3,
  },
  {
    id: "b4",
    imageUrl: "/assets/generated/bgmi-banner-1.dim_800x300.jpg",
    title: "Vikendi Winter Clash",
    link: "/tournaments",
    isVisible: true,
    order: 4,
  },
  {
    id: "b5",
    imageUrl: "/assets/generated/bgmi-banner-2.dim_800x300.jpg",
    title: "Daily Missions",
    link: "/missions",
    isVisible: true,
    order: 5,
  },
];

const initialRedemptions: RedemptionRequest[] = [
  {
    id: "r1",
    userId: "u_thunder",
    username: "ThunderBolt_K",
    amount: 500,
    upiId: "thunder@paytm",
    status: "pending",
    requestedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
    isFlagged: false,
  },
  {
    id: "r2",
    userId: "u_nova",
    username: "NovaStar_Gaming",
    amount: 200,
    upiId: "nova@phonepe",
    status: "approved",
    requestedAt: new Date(now.getTime() - 24 * 60 * 60 * 1000),
    resolvedAt: new Date(now.getTime() - 20 * 60 * 60 * 1000),
    adminNote: "Processed via UPI",
    isFlagged: false,
  },
  {
    id: "r3",
    userId: "u_apex",
    username: "ApexPredator",
    amount: 1000,
    upiId: "apex@gpay",
    status: "pending",
    requestedAt: new Date(now.getTime() - 30 * 60 * 1000),
    isFlagged: true,
  },
];

const initialAdminUsers: AdminUser[] = [
  {
    id: "u_shadow",
    username: "ShadowKiller_X",
    bgmiUid: "5231867490",
    walletBalance: 25400,
    isBanned: false,
    isPremium: true,
    role: "user",
    createdAt: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000),
    matchesPlayed: 127,
    wins: 47,
    kills: 892,
  },
  {
    id: "u_fury",
    username: "ProFury99",
    bgmiUid: "8847291034",
    walletBalance: 22100,
    isBanned: false,
    isPremium: true,
    role: "user",
    createdAt: new Date(now.getTime() - 80 * 24 * 60 * 60 * 1000),
    matchesPlayed: 114,
    wins: 42,
    kills: 751,
  },
  {
    id: "u_thunder",
    username: "ThunderBolt_K",
    bgmiUid: "3391084726",
    walletBalance: 1080,
    isBanned: false,
    isPremium: false,
    role: "user",
    createdAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
    matchesPlayed: 23,
    wins: 15,
    kills: 344,
  },
  {
    id: "u_nova",
    username: "NovaStar_Gaming",
    bgmiUid: "7712048391",
    walletBalance: 900,
    isBanned: false,
    isPremium: false,
    role: "user",
    createdAt: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000),
    matchesPlayed: 8,
    wins: 1,
    kills: 56,
  },
  {
    id: "u_apex",
    username: "ApexPredator",
    bgmiUid: "4499011823",
    walletBalance: 400,
    isBanned: true,
    isPremium: false,
    role: "user",
    createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
    matchesPlayed: 3,
    wins: 2,
    kills: 89,
  },
];

// ===== HOOK =====
export function useGameData() {
  const [walletBalance, setWalletBalance] = useState<number>(() => {
    const saved = localStorage.getItem("bgmi-wallet");
    return saved ? Number.parseInt(saved, 10) : 1080;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem("bgmi-transactions");
    return saved
      ? JSON.parse(saved).map((t: Transaction) => ({
          ...t,
          timestamp: new Date(t.timestamp),
        }))
      : initialTransactions;
  });

  const [tournaments, setTournaments] = useState<Tournament[]>(() => {
    const saved = localStorage.getItem("bgmi-tournaments");
    return saved
      ? JSON.parse(saved).map((t: Tournament) => ({
          ...t,
          startTime: new Date(t.startTime),
        }))
      : initialTournaments;
  });

  const [joinedTournaments, setJoinedTournaments] = useState<string[]>(() => {
    const saved = localStorage.getItem("bgmi-joined");
    return saved ? JSON.parse(saved) : [];
  });

  const [missions, setMissions] = useState<Mission[]>(initialMissions);
  const [leaderboard] = useState<LeaderboardEntry[]>(initialLeaderboard);
  const [notifications, setNotifications] =
    useState<Notification[]>(initialNotifications);
  const [banners, setBanners] = useState<Banner[]>(initialBanners);
  const [redemptions, setRedemptions] =
    useState<RedemptionRequest[]>(initialRedemptions);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(initialAdminUsers);

  const [isPremium, setIsPremium] = useState<boolean>(() => {
    return localStorage.getItem("bgmi-premium") === "true";
  });

  const [lastLoginDate, setLastLoginDate] = useState<string>(() => {
    return localStorage.getItem("bgmi-last-login") || "";
  });

  const [completedMissions, setCompletedMissions] = useState<string[]>(() => {
    const saved = localStorage.getItem("bgmi-completed-missions");
    return saved ? JSON.parse(saved) : [];
  });

  // Persist state
  useEffect(() => {
    localStorage.setItem("bgmi-wallet", String(walletBalance));
  }, [walletBalance]);
  useEffect(() => {
    localStorage.setItem("bgmi-transactions", JSON.stringify(transactions));
  }, [transactions]);
  useEffect(() => {
    localStorage.setItem("bgmi-tournaments", JSON.stringify(tournaments));
  }, [tournaments]);
  useEffect(() => {
    localStorage.setItem("bgmi-joined", JSON.stringify(joinedTournaments));
  }, [joinedTournaments]);
  useEffect(() => {
    localStorage.setItem("bgmi-premium", String(isPremium));
  }, [isPremium]);
  useEffect(() => {
    localStorage.setItem(
      "bgmi-completed-missions",
      JSON.stringify(completedMissions),
    );
  }, [completedMissions]);

  const addTransaction = useCallback(
    (type: TransactionType, amount: number, description: string) => {
      setWalletBalance((prev) => {
        const newBalance = type === "credit" ? prev + amount : prev - amount;
        const tx: Transaction = {
          id: `tx_${Date.now()}`,
          type,
          amount,
          description,
          timestamp: new Date(),
          balanceBefore: prev,
          balanceAfter: newBalance,
        };
        setTransactions((prevTx) => [tx, ...prevTx]);
        return newBalance;
      });
    },
    [],
  );

  const joinTournament = useCallback(
    (
      tournamentId: string,
    ): {
      success: boolean;
      message: string;
      roomId?: string;
      roomPassword?: string;
    } => {
      if (joinedTournaments.includes(tournamentId)) {
        return {
          success: false,
          message: "You already joined this tournament!",
        };
      }
      const tournament = tournaments.find((t) => t.id === tournamentId);
      if (!tournament)
        return { success: false, message: "Tournament not found" };
      if (tournament.filledSlots >= tournament.maxSlots) {
        return { success: false, message: "No slots available" };
      }
      const fee = isPremium
        ? Math.floor(tournament.entryFee * 0.9)
        : tournament.entryFee;
      if (walletBalance < fee) {
        return {
          success: false,
          message: `Insufficient balance. Need ${fee} coins.`,
        };
      }

      // Atomic: deduct coins + update slots + mark joined
      setWalletBalance((prev) => {
        const newBalance = prev - fee;
        const tx: Transaction = {
          id: `tx_${Date.now()}`,
          type: "debit",
          amount: fee,
          description: `Tournament Entry: ${tournament.title}`,
          timestamp: new Date(),
          balanceBefore: prev,
          balanceAfter: newBalance,
        };
        setTransactions((prevTx) => [tx, ...prevTx]);
        return newBalance;
      });

      setTournaments((prev) =>
        prev.map((t) =>
          t.id === tournamentId ? { ...t, filledSlots: t.filledSlots + 1 } : t,
        ),
      );
      setJoinedTournaments((prev) => [...prev, tournamentId]);

      // Add notification
      const notif: Notification = {
        id: `n_${Date.now()}`,
        message: `You joined ${tournament.title}! Room ID: ${tournament.roomId}`,
        type: "tournament",
        isRead: false,
        createdAt: new Date(),
      };
      setNotifications((prev) => [notif, ...prev]);

      return {
        success: true,
        message: "Joined successfully!",
        roomId: tournament.roomId,
        roomPassword: tournament.roomPassword,
      };
    },
    [joinedTournaments, tournaments, walletBalance, isPremium],
  );

  const claimDailyLogin = useCallback(() => {
    const today = new Date().toDateString();
    if (lastLoginDate === today) return false;
    addTransaction("credit", 10, "Daily Login Reward");
    setLastLoginDate(today);
    localStorage.setItem("bgmi-last-login", today);
    if (!completedMissions.includes("m1")) {
      setCompletedMissions((prev) => [...prev, "m1"]);
    }
    const notif: Notification = {
      id: `n_${Date.now()}`,
      message: "✅ Daily Login mission completed! +10 coins",
      type: "mission",
      isRead: false,
      createdAt: new Date(),
    };
    setNotifications((prev) => [notif, ...prev]);
    return true;
  }, [lastLoginDate, addTransaction, completedMissions]);

  const claimWatchAd = useCallback(() => {
    addTransaction("credit", 10, "Watch Ad Reward");
    if (!completedMissions.includes("m2")) {
      setCompletedMissions((prev) => [...prev, "m2"]);
    }
    const notif: Notification = {
      id: `n_${Date.now()}`,
      message: "🎯 Watch Ad mission completed! +10 coins",
      type: "mission",
      isRead: false,
      createdAt: new Date(),
    };
    setNotifications((prev) => [notif, ...prev]);
  }, [addTransaction, completedMissions]);

  const buyCoins = useCallback(
    (amount: number) => {
      addTransaction("credit", amount, "Coins Purchase");
      const notif: Notification = {
        id: `n_${Date.now()}`,
        message: `⚡ ${amount} coins credited to your wallet!`,
        type: "coins",
        isRead: false,
        createdAt: new Date(),
      };
      setNotifications((prev) => [notif, ...prev]);
    },
    [addTransaction],
  );

  const redeemCoins = useCallback(
    (amount: number, upiId: string) => {
      if (walletBalance < amount) return false;
      addTransaction("debit", amount, `Redemption Request (UPI: ${upiId})`);
      const req: RedemptionRequest = {
        id: `r_${Date.now()}`,
        userId: "u_thunder",
        username: "ThunderBolt_K",
        amount,
        upiId,
        status: "pending",
        requestedAt: new Date(),
      };
      setRedemptions((prev) => [req, ...prev]);
      return true;
    },
    [walletBalance, addTransaction],
  );

  const subscribePremium = useCallback(() => {
    if (walletBalance < 199) return false;
    addTransaction("debit", 199, "Premium Subscription");
    setIsPremium(true);
    return true;
  }, [walletBalance, addTransaction]);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }, []);

  const unreadNotificationCount = notifications.filter((n) => !n.isRead).length;

  const canClaimDailyLogin = lastLoginDate !== new Date().toDateString();

  // Admin actions
  const updateAdminUser = useCallback(
    (userId: string, updates: Partial<AdminUser>) => {
      setAdminUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, ...updates } : u)),
      );
    },
    [],
  );

  const adminCreditCoins = useCallback(
    (userId: string, amount: number, reason: string) => {
      setAdminUsers((prev) =>
        prev.map((u) =>
          u.id === userId
            ? { ...u, walletBalance: u.walletBalance + amount }
            : u,
        ),
      );
      // If it's current user
      if (userId === "u_thunder") {
        addTransaction("credit", amount, `Admin Credit: ${reason}`);
      }
    },
    [addTransaction],
  );

  const updateRedemption = useCallback(
    (id: string, status: RedemptionStatus, note?: string) => {
      setRedemptions((prev) =>
        prev.map((r) =>
          r.id === id
            ? { ...r, status, adminNote: note, resolvedAt: new Date() }
            : r,
        ),
      );
    },
    [],
  );

  const addTournament = useCallback(
    (t: Omit<Tournament, "id" | "filledSlots">) => {
      const newT: Tournament = { ...t, id: `t_${Date.now()}`, filledSlots: 0 };
      setTournaments((prev) => [newT, ...prev]);
    },
    [],
  );

  const updateTournament = useCallback(
    (id: string, updates: Partial<Tournament>) => {
      setTournaments((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...updates } : t)),
      );
    },
    [],
  );

  const deleteTournament = useCallback((id: string) => {
    setTournaments((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const updateMission = useCallback((id: string, updates: Partial<Mission>) => {
    setMissions((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updates } : m)),
    );
  }, []);

  const addMission = useCallback((m: Omit<Mission, "id">) => {
    setMissions((prev) => [...prev, { ...m, id: `m_${Date.now()}` }]);
  }, []);

  const deleteMission = useCallback((id: string) => {
    setMissions((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const updateBanner = useCallback((id: string, updates: Partial<Banner>) => {
    setBanners((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updates } : b)),
    );
  }, []);

  const addBanner = useCallback((b: Omit<Banner, "id">) => {
    setBanners((prev) => [...prev, { ...b, id: `b_${Date.now()}` }]);
  }, []);

  const deleteBanner = useCallback((id: string) => {
    setBanners((prev) => prev.filter((b) => b.id !== id));
  }, []);

  return {
    // State
    walletBalance,
    transactions,
    tournaments,
    joinedTournaments,
    missions,
    leaderboard,
    notifications,
    banners,
    redemptions,
    adminUsers,
    isPremium,
    canClaimDailyLogin,
    completedMissions,
    unreadNotificationCount,
    // Actions
    joinTournament,
    claimDailyLogin,
    claimWatchAd,
    buyCoins,
    redeemCoins,
    subscribePremium,
    markAllNotificationsRead,
    addTransaction,
    updateAdminUser,
    adminCreditCoins,
    updateRedemption,
    addTournament,
    updateTournament,
    deleteTournament,
    updateMission,
    addMission,
    deleteMission,
    updateBanner,
    addBanner,
    deleteBanner,
    setNotifications,
  };
}
