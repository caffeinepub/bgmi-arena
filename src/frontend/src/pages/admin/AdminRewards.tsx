import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Gift, Plus, Tag, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Reward {
  id: string;
  name: string;
  description: string;
  coinCost: number;
  category: string;
  imageUrl?: string;
}

const initialRewards: Reward[] = [
  {
    id: "rw1",
    name: "Amazon Gift Card ₹100",
    description: "Amazon e-gift card worth ₹100",
    coinCost: 1000,
    category: "Gift Cards",
  },
  {
    id: "rw2",
    name: "Paytm Cashback ₹50",
    description: "Direct Paytm wallet credit",
    coinCost: 500,
    category: "Cashback",
  },
  {
    id: "rw3",
    name: "BGMI Royal Pass",
    description: "Royal Pass A1 Season",
    coinCost: 2000,
    category: "In-Game",
  },
  {
    id: "rw4",
    name: "Phone Recharge ₹10",
    description: "Mobile recharge voucher",
    coinCost: 200,
    category: "Recharge",
  },
];

const CATEGORIES = ["Gift Cards", "Cashback", "In-Game", "Recharge", "Other"];

export default function AdminRewards() {
  const [rewards, setRewards] = useState<Reward[]>(initialRewards);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    coinCost: "100",
    category: "Other",
  });

  const handleCreate = () => {
    if (!form.name.trim()) {
      toast.error("Name required");
      return;
    }
    const newReward: Reward = {
      id: `rw_${Date.now()}`,
      name: form.name,
      description: form.description,
      coinCost: Number.parseInt(form.coinCost) || 0,
      category: form.category,
    };
    setRewards((prev) => [newReward, ...prev]);
    toast.success("Reward added!");
    setShowForm(false);
    setForm({ name: "", description: "", coinCost: "100", category: "Other" });
  };

  const handleDelete = (id: string) => {
    setRewards((prev) => prev.filter((r) => r.id !== id));
    toast.success("Reward removed");
  };

  const groupedByCategory = CATEGORIES.reduce(
    (acc, cat) => {
      const items = rewards.filter((r) => r.category === cat);
      if (items.length > 0) acc[cat] = items;
      return acc;
    },
    {} as Record<string, Reward[]>,
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Rewards Gallery</h1>
          <p className="text-sm text-muted-foreground">
            {rewards.length} rewards available
          </p>
        </div>
        <Button
          className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
          onClick={() => setShowForm(true)}
          data-ocid="admin.rewards.create.button"
        >
          <Plus className="w-4 h-4" /> Add Reward
        </Button>
      </div>

      {Object.entries(groupedByCategory).map(([category, items]) => (
        <div key={category}>
          <div className="flex items-center gap-2 mb-2">
            <Tag className="w-3.5 h-3.5 text-muted-foreground" />
            <h2 className="text-xs font-semibold text-muted-foreground uppercase">
              {category}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {items.map((reward, i) => (
              <div
                key={reward.id}
                className="game-card p-4 flex items-center gap-3"
                data-ocid={`admin.rewards.item.${i + 1}`}
              >
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Gift className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-foreground">
                    {reward.name}
                  </p>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {reward.description}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-xs font-bold text-yellow-400">
                      {reward.coinCost.toLocaleString()} ⚡
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-7 h-7 text-destructive hover:text-destructive flex-shrink-0"
                  onClick={() => handleDelete(reward.id)}
                  data-ocid={`admin.rewards.delete.${i + 1}`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      ))}

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent data-ocid="admin.rewards.form.dialog">
          <DialogHeader>
            <DialogTitle>Add Reward</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label className="text-xs">Reward Name</Label>
              <Input
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                placeholder="e.g., Amazon Gift Card"
                data-ocid="admin.rewards.name.input"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Description</Label>
              <Input
                value={form.description}
                onChange={(e) =>
                  setForm((p) => ({ ...p, description: e.target.value }))
                }
                placeholder="Short description"
                data-ocid="admin.rewards.description.input"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Coin Cost</Label>
                <Input
                  type="number"
                  value={form.coinCost}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, coinCost: e.target.value }))
                  }
                  data-ocid="admin.rewards.coin_cost.input"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Category</Label>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, category: e.target.value }))
                  }
                  className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowForm(false)}
                data-ocid="admin.rewards.cancel.button"
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={handleCreate}
                data-ocid="admin.rewards.save.button"
              >
                Add
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
