import { Toaster } from "@/components/ui/sonner";
import {
  Link,
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  useLocation,
  useNavigate,
} from "@tanstack/react-router";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Leaderboard from "./pages/Leaderboard";
import Missions from "./pages/Missions";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import Tournaments from "./pages/Tournaments";
import Wallet from "./pages/Wallet";
import AdminBanners from "./pages/admin/AdminBanners";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminMissions from "./pages/admin/AdminMissions";
import AdminRedemptions from "./pages/admin/AdminRedemptions";
import AdminResults from "./pages/admin/AdminResults";
import AdminRewards from "./pages/admin/AdminRewards";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminTournaments from "./pages/admin/AdminTournaments";
import AdminUsers from "./pages/admin/AdminUsers";

// Re-export link/navigation utilities for components
export { Link, useNavigate, useLocation };

// Route tree
const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});
const tournamentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/tournaments",
  component: Tournaments,
});
const walletRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/wallet",
  component: Wallet,
});
const missionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/missions",
  component: Missions,
});
const leaderboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/leaderboard",
  component: Leaderboard,
});
const notificationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/notifications",
  component: Notifications,
});
const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  component: Profile,
});

// Admin routes
const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminLayout,
});
const adminIndexRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "/",
  component: AdminDashboard,
});
const adminDashboardRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "/dashboard",
  component: AdminDashboard,
});
const adminTournamentsRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "/tournaments",
  component: AdminTournaments,
});
const adminResultsRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "/results",
  component: AdminResults,
});
const adminUsersRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "/users",
  component: AdminUsers,
});
const adminRedemptionsRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "/redemptions",
  component: AdminRedemptions,
});
const adminMissionsRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "/missions",
  component: AdminMissions,
});
const adminRewardsRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "/rewards",
  component: AdminRewards,
});
const adminBannersRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "/banners",
  component: AdminBanners,
});
const adminSettingsRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "/settings",
  component: AdminSettings,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  tournamentsRoute,
  walletRoute,
  missionsRoute,
  leaderboardRoute,
  notificationsRoute,
  profileRoute,
  adminRoute.addChildren([
    adminIndexRoute,
    adminDashboardRoute,
    adminTournamentsRoute,
    adminResultsRoute,
    adminUsersRoute,
    adminRedemptionsRoute,
    adminMissionsRoute,
    adminRewardsRoute,
    adminBannersRoute,
    adminSettingsRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
      <Toaster richColors position="top-center" />
    </ThemeProvider>
  );
}
