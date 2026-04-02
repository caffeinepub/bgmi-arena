import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Edit, Plus, Target, Trash2, Zap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import ConfirmModal from "../../components/ConfirmModal";
import { useGameData } from "../../hooks/useGameData";
import type { Mission, MissionType } from "../../hooks/useGameData";

interface MissionForm {
  name: string;
  description: string;
  type: MissionType;
  rewardCoins: string;
  isActive: boolean;
}

const emptyForm: MissionForm = {
  name: "",
  description: "",
  type: "custom",
  rewardCoins: "10",
  isActive: true,
};

export default function AdminMissions() {
  const game = useGameData();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<MissionForm>(emptyForm);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const openCreate = () => {
    setForm(emptyForm);
    setEditId(null);
    setShowForm(true);
  };

  const openEdit = (m: Mission) => {
    setForm({
      name: m.name,
      description: m.description,
      type: m.type,
      rewardCoins: String(m.rewardCoins),
      isActive: m.isActive,
    });
    setEditId(m.id);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) {
      toast.error("Name required");
      return;
    }
    const data = {
      name: form.name,
      description: form.description,
      type: form.type,
      rewardCoins: Number.parseInt(form.rewardCoins) || 0,
      isActive: form.isActive,
    };
    if (editId) {
      game.updateMission(editId, data);
      toast.success("Mission updated!");
    } else {
      game.addMission(data);
      toast.success("Mission created!");
    }
    setShowForm(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">
            Mission Management
          </h1>
          <p className="text-sm text-muted-foreground">
            {game.missions.length} missions
          </p>
        </div>
        <Button
          className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
          onClick={openCreate}
          data-ocid="admin.missions.create.button"
        >
          <Plus className="w-4 h-4" /> Create
        </Button>
      </div>

      <div className="space-y-3">
        {game.missions.map((m, i) => (
          <div
            key={m.id}
            className="game-card p-4 flex items-center gap-4"
            data-ocid={`admin.missions.item.${i + 1}`}
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm text-foreground">
                  {m.name}
                </h3>
                <span className="text-[10px] bg-secondary text-muted-foreground px-2 py-0.5 rounded-full">
                  {m.type}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {m.description}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <Zap className="w-3 h-3 text-yellow-400" />
                <span className="text-xs font-bold text-yellow-400">
                  {m.rewardCoins} coins
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={m.isActive}
                onCheckedChange={(v) =>
                  game.updateMission(m.id, { isActive: v })
                }
                data-ocid={`admin.missions.toggle.${i + 1}`}
              />
              <Button
                variant="ghost"
                size="icon"
                className="w-7 h-7"
                onClick={() => openEdit(m)}
                data-ocid={`admin.missions.edit.${i + 1}`}
              >
                <Edit className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="w-7 h-7 text-destructive hover:text-destructive"
                onClick={() => setDeleteId(m.id)}
                data-ocid={`admin.missions.delete.${i + 1}`}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent data-ocid="admin.missions.form.dialog">
          <DialogHeader>
            <DialogTitle>
              {editId ? "Edit Mission" : "Create Mission"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label className="text-xs">Mission Name</Label>
              <Input
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                placeholder="Mission name"
                data-ocid="admin.missions.name.input"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Description</Label>
              <Input
                value={form.description}
                onChange={(e) =>
                  setForm((p) => ({ ...p, description: e.target.value }))
                }
                placeholder="Description"
                data-ocid="admin.missions.description.input"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Type</Label>
                <Select
                  value={form.type}
                  onValueChange={(v) =>
                    setForm((p) => ({ ...p, type: v as MissionType }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(
                      [
                        "daily_login",
                        "watch_ad",
                        "play_match",
                        "custom",
                      ] as MissionType[]
                    ).map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Reward Coins</Label>
                <Input
                  type="number"
                  value={form.rewardCoins}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, rewardCoins: e.target.value }))
                  }
                  data-ocid="admin.missions.reward.input"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={form.isActive}
                onCheckedChange={(v) => setForm((p) => ({ ...p, isActive: v }))}
              />
              <Label className="text-xs">Active</Label>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowForm(false)}
                data-ocid="admin.missions.cancel.button"
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={handleSave}
                data-ocid="admin.missions.save.button"
              >
                {editId ? "Update" : "Create"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) {
            game.deleteMission(deleteId);
            toast.success("Mission deleted");
            setDeleteId(null);
          }
        }}
        title="Delete Mission"
        description="Delete this mission? This cannot be undone."
        confirmLabel="Delete"
        variant="destructive"
      />
    </div>
  );
}
