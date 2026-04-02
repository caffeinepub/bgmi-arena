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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Edit, Eye, Plus, Trash2, Trophy, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import ConfirmModal from "../../components/ConfirmModal";
import { useGameData } from "../../hooks/useGameData";
import type {
  MapType,
  Tournament,
  TournamentMode,
  TournamentStatus,
} from "../../hooks/useGameData";

const STATUS_COLORS: Record<TournamentStatus, string> = {
  upcoming: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
  live: "bg-red-500/20 text-red-400 border border-red-500/30",
  completed: "bg-muted text-muted-foreground",
};

interface TournamentFormData {
  title: string;
  map: MapType;
  mode: TournamentMode;
  entryFee: string;
  prizePool: string;
  startTime: string;
  maxSlots: string;
  roomId: string;
  roomPassword: string;
  status: TournamentStatus;
  description: string;
}

const emptyForm: TournamentFormData = {
  title: "",
  map: "Erangel",
  mode: "Squad",
  entryFee: "50",
  prizePool: "5000",
  startTime: "",
  maxSlots: "100",
  roomId: "",
  roomPassword: "",
  status: "upcoming",
  description: "",
};

export default function AdminTournaments() {
  const game = useGameData();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<TournamentFormData>(emptyForm);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewId, setViewId] = useState<string | null>(null);

  const openCreate = () => {
    setForm(emptyForm);
    setEditId(null);
    setShowForm(true);
  };

  const openEdit = (t: Tournament) => {
    setForm({
      title: t.title,
      map: t.map,
      mode: t.mode,
      entryFee: String(t.entryFee),
      prizePool: String(t.prizePool),
      startTime: t.startTime.toISOString().slice(0, 16),
      maxSlots: String(t.maxSlots),
      roomId: t.roomId,
      roomPassword: t.roomPassword,
      status: t.status,
      description: t.description,
    });
    setEditId(t.id);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.title.trim()) {
      toast.error("Title required");
      return;
    }
    if (!form.startTime) {
      toast.error("Start time required");
      return;
    }
    if (!form.roomId.trim()) {
      toast.error("Room ID required");
      return;
    }

    const data = {
      title: form.title,
      map: form.map,
      mode: form.mode,
      entryFee: Number.parseInt(form.entryFee) || 0,
      prizePool: Number.parseInt(form.prizePool) || 0,
      startTime: new Date(form.startTime),
      maxSlots: Number.parseInt(form.maxSlots) || 100,
      roomId: form.roomId,
      roomPassword: form.roomPassword,
      status: form.status,
      description: form.description,
    };

    if (editId) {
      game.updateTournament(editId, data);
      toast.success("Tournament updated!");
    } else {
      game.addTournament(data);
      toast.success("Tournament created!");
    }
    setShowForm(false);
  };

  const handleDelete = () => {
    if (!deleteId) return;
    game.deleteTournament(deleteId);
    toast.success("Tournament deleted");
    setDeleteId(null);
  };

  const viewingTournament = viewId
    ? game.tournaments.find((t) => t.id === viewId)
    : null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Tournaments</h1>
          <p className="text-sm text-muted-foreground">
            {game.tournaments.length} total tournaments
          </p>
        </div>
        <Button
          className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
          onClick={openCreate}
          data-ocid="admin.tournaments.create.button"
        >
          <Plus className="w-4 h-4" />
          Create
        </Button>
      </div>

      {/* Table */}
      <div className="game-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-3 text-xs font-semibold text-muted-foreground uppercase">
                  Title
                </th>
                <th className="text-left p-3 text-xs font-semibold text-muted-foreground uppercase">
                  Map/Mode
                </th>
                <th className="text-center p-3 text-xs font-semibold text-muted-foreground uppercase">
                  Status
                </th>
                <th className="text-center p-3 text-xs font-semibold text-muted-foreground uppercase">
                  Slots
                </th>
                <th className="text-center p-3 text-xs font-semibold text-muted-foreground uppercase">
                  Fee/Prize
                </th>
                <th className="text-right p-3 text-xs font-semibold text-muted-foreground uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {game.tournaments.map((t, i) => (
                <tr
                  key={t.id}
                  className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
                  data-ocid={`admin.tournaments.row.${i + 1}`}
                >
                  <td className="p-3">
                    <p className="font-medium text-foreground line-clamp-1">
                      {t.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t.startTime.toLocaleDateString()}
                    </p>
                  </td>
                  <td className="p-3">
                    <p className="text-xs text-foreground">{t.map}</p>
                    <p className="text-xs text-muted-foreground">{t.mode}</p>
                  </td>
                  <td className="p-3 text-center">
                    <Badge className={cn("text-xs", STATUS_COLORS[t.status])}>
                      {t.status}
                    </Badge>
                  </td>
                  <td className="p-3 text-center text-xs text-foreground">
                    {t.filledSlots}/{t.maxSlots}
                  </td>
                  <td className="p-3 text-center">
                    <p className="text-xs text-yellow-400">{t.entryFee} ⚡</p>
                    <p className="text-xs text-primary">
                      {t.prizePool.toLocaleString()} ⚡
                    </p>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-7 h-7"
                        onClick={() => setViewId(t.id)}
                        data-ocid={`admin.tournaments.view.${i + 1}`}
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-7 h-7"
                        onClick={() => openEdit(t)}
                        data-ocid={`admin.tournaments.edit.${i + 1}`}
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-7 h-7 text-destructive hover:text-destructive"
                        onClick={() => setDeleteId(t.id)}
                        data-ocid={`admin.tournaments.delete.${i + 1}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent
          className="max-w-lg max-h-[90vh] overflow-y-auto"
          data-ocid="admin.tournaments.form.dialog"
        >
          <DialogHeader>
            <DialogTitle>
              {editId ? "Edit Tournament" : "Create Tournament"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label className="text-xs">Title</Label>
              <Input
                value={form.title}
                onChange={(e) =>
                  setForm((p) => ({ ...p, title: e.target.value }))
                }
                placeholder="Tournament title"
                data-ocid="admin.tournaments.title.input"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Map</Label>
                <Select
                  value={form.map}
                  onValueChange={(v) =>
                    setForm((p) => ({ ...p, map: v as MapType }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["Erangel", "Miramar", "Sanhok", "Vikendi"].map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Mode</Label>
                <Select
                  value={form.mode}
                  onValueChange={(v) =>
                    setForm((p) => ({ ...p, mode: v as TournamentMode }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["Solo", "Duo", "Squad"].map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Entry Fee (coins)</Label>
                <Input
                  type="number"
                  value={form.entryFee}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, entryFee: e.target.value }))
                  }
                  data-ocid="admin.tournaments.entry_fee.input"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Prize Pool (coins)</Label>
                <Input
                  type="number"
                  value={form.prizePool}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, prizePool: e.target.value }))
                  }
                  data-ocid="admin.tournaments.prize_pool.input"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Start Time</Label>
                <Input
                  type="datetime-local"
                  value={form.startTime}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, startTime: e.target.value }))
                  }
                  data-ocid="admin.tournaments.start_time.input"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Max Slots</Label>
                <Input
                  type="number"
                  value={form.maxSlots}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, maxSlots: e.target.value }))
                  }
                  data-ocid="admin.tournaments.max_slots.input"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Room ID</Label>
                <Input
                  value={form.roomId}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, roomId: e.target.value }))
                  }
                  data-ocid="admin.tournaments.room_id.input"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Room Password</Label>
                <Input
                  value={form.roomPassword}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, roomPassword: e.target.value }))
                  }
                  data-ocid="admin.tournaments.room_password.input"
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Status</Label>
              <Select
                value={form.status}
                onValueChange={(v) =>
                  setForm((p) => ({ ...p, status: v as TournamentStatus }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["upcoming", "live", "completed"].map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowForm(false)}
                data-ocid="admin.tournaments.cancel.button"
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={handleSave}
                data-ocid="admin.tournaments.save.button"
              >
                {editId ? "Update" : "Create"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      {viewingTournament && (
        <Dialog open={!!viewId} onOpenChange={() => setViewId(null)}>
          <DialogContent data-ocid="admin.tournaments.view.dialog">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-primary" />
                {viewingTournament.title}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-secondary rounded-xl p-3">
                  <p className="text-xs text-muted-foreground">
                    Registered Players
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Users className="w-4 h-4 text-primary" />
                    <span className="font-bold text-foreground">
                      {viewingTournament.filledSlots}
                    </span>
                  </div>
                </div>
                <div className="bg-secondary rounded-xl p-3">
                  <p className="text-xs text-muted-foreground">
                    Slots Remaining
                  </p>
                  <span className="font-bold text-foreground">
                    {viewingTournament.maxSlots - viewingTournament.filledSlots}
                  </span>
                </div>
              </div>
              <div className="bg-secondary rounded-xl p-3 space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Room ID</span>
                  <span className="font-mono font-bold text-primary">
                    {viewingTournament.roomId}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Password</span>
                  <span className="font-mono font-bold">
                    {viewingTournament.roomPassword}
                  </span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                {viewingTournament.description}
              </p>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <ConfirmModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Tournament"
        description="Are you sure you want to delete this tournament? This action cannot be undone."
        confirmLabel="Delete"
        variant="destructive"
      />
    </div>
  );
}
