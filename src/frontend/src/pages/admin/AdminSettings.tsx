import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Bell, Coins, Globe, Save, Settings, Shield } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface AppSettings {
  appName: string;
  maintenanceMode: boolean;
  registrationOpen: boolean;
  dailyLoginCoins: number;
  minRedemptionCoins: number;
  maxRedemptionCoins: number;
  premiumPrice: number;
  premiumDiscountPercent: number;
  supportEmail: string;
}

const DEFAULT_SETTINGS: AppSettings = {
  appName: "BGMI Arena",
  maintenanceMode: false,
  registrationOpen: true,
  dailyLoginCoins: 10,
  minRedemptionCoins: 100,
  maxRedemptionCoins: 10000,
  premiumPrice: 199,
  premiumDiscountPercent: 10,
  supportEmail: "support@bgmiarena.in",
};

export default function AdminSettings() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  const handleSave = () => {
    toast.success("Settings saved!");
  };

  const update = <K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K],
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-bold text-foreground">App Settings</h1>
        <p className="text-sm text-muted-foreground">
          Configure BGMI Arena platform settings
        </p>
      </div>

      {/* General */}
      <div className="game-card p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-primary" />
          <h2 className="font-semibold text-sm">General</h2>
        </div>
        <Separator />
        <div className="space-y-3">
          <div className="space-y-1">
            <Label className="text-xs">App Name</Label>
            <Input
              value={settings.appName}
              onChange={(e) => update("appName", e.target.value)}
              data-ocid="admin.settings.app_name.input"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Support Email</Label>
            <Input
              value={settings.supportEmail}
              onChange={(e) => update("supportEmail", e.target.value)}
              type="email"
              data-ocid="admin.settings.support_email.input"
            />
          </div>
        </div>
      </div>

      {/* Access Control */}
      <div className="game-card p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-primary" />
          <h2 className="font-semibold text-sm">Access Control</h2>
        </div>
        <Separator />
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">
                Maintenance Mode
              </p>
              <p className="text-xs text-muted-foreground">
                Disable user access while maintenance is in progress
              </p>
            </div>
            <Switch
              checked={settings.maintenanceMode}
              onCheckedChange={(v) => update("maintenanceMode", v)}
              data-ocid="admin.settings.maintenance.switch"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">
                Open Registration
              </p>
              <p className="text-xs text-muted-foreground">
                Allow new users to register
              </p>
            </div>
            <Switch
              checked={settings.registrationOpen}
              onCheckedChange={(v) => update("registrationOpen", v)}
              data-ocid="admin.settings.registration.switch"
            />
          </div>
        </div>
      </div>

      {/* Coin Settings */}
      <div className="game-card p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Coins className="w-4 h-4 text-yellow-400" />
          <h2 className="font-semibold text-sm">Coin Settings</h2>
        </div>
        <Separator />
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs">Daily Login Reward (coins)</Label>
            <Input
              type="number"
              value={settings.dailyLoginCoins}
              onChange={(e) =>
                update("dailyLoginCoins", Number.parseInt(e.target.value) || 0)
              }
              data-ocid="admin.settings.daily_coins.input"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Premium Price (coins)</Label>
            <Input
              type="number"
              value={settings.premiumPrice}
              onChange={(e) =>
                update("premiumPrice", Number.parseInt(e.target.value) || 0)
              }
              data-ocid="admin.settings.premium_price.input"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Min Redemption (coins)</Label>
            <Input
              type="number"
              value={settings.minRedemptionCoins}
              onChange={(e) =>
                update(
                  "minRedemptionCoins",
                  Number.parseInt(e.target.value) || 0,
                )
              }
              data-ocid="admin.settings.min_redemption.input"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Max Redemption (coins)</Label>
            <Input
              type="number"
              value={settings.maxRedemptionCoins}
              onChange={(e) =>
                update(
                  "maxRedemptionCoins",
                  Number.parseInt(e.target.value) || 0,
                )
              }
              data-ocid="admin.settings.max_redemption.input"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Premium Discount (%)</Label>
            <Input
              type="number"
              value={settings.premiumDiscountPercent}
              onChange={(e) =>
                update(
                  "premiumDiscountPercent",
                  Number.parseInt(e.target.value) || 0,
                )
              }
              data-ocid="admin.settings.premium_discount.input"
            />
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="game-card p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-primary" />
          <h2 className="font-semibold text-sm">Notifications</h2>
        </div>
        <Separator />
        <div className="space-y-3">
          {[
            { label: "Tournament Join Notifications", key: "tournamentJoin" },
            { label: "Result Published Notifications", key: "resultPublished" },
            { label: "Coin Credit Notifications", key: "coinCredit" },
            {
              label: "Redemption Status Notifications",
              key: "redemptionStatus",
            },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <p className="text-sm text-foreground">{item.label}</p>
              <Switch
                defaultChecked
                data-ocid={`admin.settings.${item.key}.switch`}
              />
            </div>
          ))}
        </div>
      </div>

      <Button
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
        onClick={handleSave}
        data-ocid="admin.settings.save.button"
      >
        <Save className="w-4 h-4" />
        Save Settings
      </Button>
    </div>
  );
}
