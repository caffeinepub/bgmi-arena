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
import { Textarea } from "@/components/ui/textarea";
import { Check, FileImage, Plus, Scan, Trophy } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { useGameData } from "../../hooks/useGameData";

interface ResultEntry {
  userId: string;
  username: string;
  rank: number;
  kills: number;
  points: number;
  prize: number;
}

const PRIZE_DISTRIBUTION: Record<number, number> = {
  1: 0.4,
  2: 0.25,
  3: 0.15,
  4: 0.08,
  5: 0.05,
};

const OCR_PLACEHOLDER =
  "1  ThunderBolt_K  8\n2  ShadowKiller_X  6\n3  ProFury99  4";

function parseOcrText(text: string): Partial<ResultEntry>[] {
  const results: Partial<ResultEntry>[] = [];
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  for (const line of lines) {
    // Pattern: "1  ThunderBolt_K  8" or "1. ThunderBolt_K 8"
    const simple = line.match(/^(\d+)[.\s]+([\w_\-. ]+?)\s+(\d+)$/);
    if (simple) {
      results.push({
        rank: Number.parseInt(simple[1]),
        username: simple[2].trim(),
        kills: Number.parseInt(simple[3]),
      });
      continue;
    }

    // Pattern: "Rank 1  ThunderBolt_K  Kills: 8"
    const verbose = line.match(
      /[Rr]ank\s*(\d+)\s+([\w_\-. ]+?)\s+[Kk]ills?:?\s*(\d+)/,
    );
    if (verbose) {
      results.push({
        rank: Number.parseInt(verbose[1]),
        username: verbose[2].trim(),
        kills: Number.parseInt(verbose[3]),
      });
      continue;
    }

    // Pattern: "#1 ThunderBolt_K 8 kills"
    const hashtag = line.match(/#(\d+)\s+([\w_\-. ]+?)\s+(\d+)\s*[Kk]ills?/);
    if (hashtag) {
      results.push({
        rank: Number.parseInt(hashtag[1]),
        username: hashtag[2].trim(),
        kills: Number.parseInt(hashtag[3]),
      });
      continue;
    }

    // Pattern: columns like "1 | ThunderBolt_K | 8"
    const piped = line.match(/^(\d+)\s*[|\t]\s*([\w_\-. ]+?)\s*[|\t]\s*(\d+)/);
    if (piped) {
      results.push({
        rank: Number.parseInt(piped[1]),
        username: piped[2].trim(),
        kills: Number.parseInt(piped[3]),
      });
    }
  }

  return results;
}

export default function AdminResults() {
  const game = useGameData();
  const completedTournaments = game.tournaments.filter(
    (t) => t.status === "completed" || t.status === "live",
  );
  const [selectedTournamentId, setSelectedTournamentId] = useState<string>(
    completedTournaments[0]?.id || "",
  );
  const [entries, setEntries] = useState<ResultEntry[]>([
    {
      userId: "u_thunder",
      username: "ThunderBolt_K",
      rank: 1,
      kills: 8,
      points: 0,
      prize: 0,
    },
    {
      userId: "u_shadow",
      username: "ShadowKiller_X",
      rank: 2,
      kills: 6,
      points: 0,
      prize: 0,
    },
    {
      userId: "u_fury",
      username: "ProFury99",
      rank: 3,
      kills: 4,
      points: 0,
      prize: 0,
    },
    {
      userId: "u_nova",
      username: "NovaStar_Gaming",
      rank: 4,
      kills: 2,
      points: 0,
      prize: 0,
    },
    {
      userId: "u_apex",
      username: "ApexPredator",
      rank: 5,
      kills: 1,
      points: 0,
      prize: 0,
    },
  ]);
  const [published, setPublished] = useState(false);

  // OCR upload state
  const [ocrOpen, setOcrOpen] = useState(false);
  const [ocrPreviewUrl, setOcrPreviewUrl] = useState<string | null>(null);
  const [ocrText, setOcrText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedTournament = game.tournaments.find(
    (t) => t.id === selectedTournamentId,
  );

  const publishResults = () => {
    if (!selectedTournament) return;
    // Calculate prizes before publishing
    const withPrizes = entries.map((e) => {
      const prizeShare = PRIZE_DISTRIBUTION[e.rank] || 0;
      const prize = Math.floor(selectedTournament.prizePool * prizeShare);
      return { ...e, prize };
    });
    setEntries(withPrizes);
    toast.success(`Results published for ${selectedTournament.title}!`);
    setPublished(true);
    game.addTransaction(
      "credit",
      withPrizes.find((e) => e.userId === "u_thunder")?.prize || 0,
      `Tournament Prize: ${selectedTournament.title}`,
    );
  };

  const updateEntry = (
    index: number,
    field: keyof ResultEntry,
    value: string,
  ) => {
    setEntries((prev) =>
      prev.map((e, i) =>
        i === index
          ? {
              ...e,
              [field]:
                field === "username" || field === "userId"
                  ? value
                  : Number.parseInt(value) || 0,
            }
          : e,
      ),
    );
  };

  const addEntry = () => {
    setEntries((prev) => [
      ...prev,
      {
        userId: "",
        username: "",
        rank: prev.length + 1,
        kills: 0,
        points: 0,
        prize: 0,
      },
    ]);
  };

  const handleScreenshotSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setOcrPreviewUrl(url);
    setOcrText("");
    setOcrOpen(true);
    toast.info(
      "Screenshot uploaded! Paste or type OCR text below to parse results.",
    );
    // Reset input so same file can be re-selected
    e.target.value = "";
  };

  const handleParseResults = () => {
    if (!ocrText.trim()) {
      toast.error("Paste the text from your screenshot first.");
      return;
    }
    const parsed = parseOcrText(ocrText);
    if (parsed.length === 0) {
      toast.error(
        "Could not parse any player data. Check the format and try again.",
      );
      return;
    }
    const newEntries: ResultEntry[] = parsed.map((p) => ({
      userId: `u_${(p.username || "player").toLowerCase().replace(/\W+/g, "_")}`,
      username: p.username || "",
      rank: p.rank || 0,
      kills: p.kills || 0,
      points: 0,
      prize: 0,
    }));
    setEntries(newEntries);
    toast.success(`Parsed ${newEntries.length} players from OCR text!`);
    setOcrOpen(false);
  };

  const closeOcr = () => {
    setOcrOpen(false);
    if (ocrPreviewUrl) {
      URL.revokeObjectURL(ocrPreviewUrl);
      setOcrPreviewUrl(null);
    }
    setOcrText("");
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-foreground">Results Entry</h1>
        <p className="text-sm text-muted-foreground">
          Post tournament results and distribute prizes
        </p>
      </div>

      {/* Tournament Selector */}
      <div className="game-card p-4 space-y-3">
        <div className="space-y-1">
          <Label className="text-xs">Select Tournament</Label>
          <Select
            value={selectedTournamentId}
            onValueChange={setSelectedTournamentId}
          >
            <SelectTrigger data-ocid="admin.results.tournament.select">
              <SelectValue placeholder="Select a tournament" />
            </SelectTrigger>
            <SelectContent>
              {completedTournaments.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {selectedTournament && (
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-primary" />
              <span>
                Prize: {selectedTournament.prizePool.toLocaleString()} ⚡
              </span>
            </div>
            <Badge className="text-xs">
              {selectedTournament.map} • {selectedTournament.mode}
            </Badge>
          </div>
        )}
      </div>

      {/* Hidden file input for OCR screenshot */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleScreenshotSelect}
        data-ocid="admin.results.screenshot.upload_button"
      />

      {/* Entries Table */}
      <div className="game-card overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="font-semibold text-sm">Player Results</h2>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="h-8 gap-1"
              data-ocid="admin.results.upload_screenshot.button"
            >
              <Scan className="w-3.5 h-3.5" /> Upload Screenshot
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={addEntry}
              className="h-8 gap-1"
              data-ocid="admin.results.add_player.button"
            >
              <Plus className="w-3.5 h-3.5" /> Add Player
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-3 text-muted-foreground font-semibold uppercase">
                  Player
                </th>
                <th className="text-center p-3 text-muted-foreground font-semibold uppercase">
                  Rank
                </th>
                <th className="text-center p-3 text-muted-foreground font-semibold uppercase">
                  Kills
                </th>
                <th className="text-center p-3 text-muted-foreground font-semibold uppercase">
                  Prize ⚡
                </th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, i) => (
                <tr
                  key={entry.userId || i}
                  className="border-b border-border last:border-0"
                  data-ocid={`admin.results.row.${i + 1}`}
                >
                  <td className="p-2">
                    <Input
                      value={entry.username}
                      onChange={(e) =>
                        updateEntry(i, "username", e.target.value)
                      }
                      className="h-7 text-xs"
                      placeholder="Username"
                    />
                  </td>
                  <td className="p-2">
                    <Input
                      type="number"
                      value={entry.rank}
                      onChange={(e) => updateEntry(i, "rank", e.target.value)}
                      className="h-7 text-xs text-center w-16 mx-auto"
                      min="1"
                    />
                  </td>
                  <td className="p-2">
                    <Input
                      type="number"
                      value={entry.kills}
                      onChange={(e) => updateEntry(i, "kills", e.target.value)}
                      className="h-7 text-xs text-center w-16 mx-auto"
                      min="0"
                    />
                  </td>
                  <td className="p-2 text-center">
                    <span className="text-yellow-400 font-bold">
                      {entry.prize > 0 ? `${entry.prize} ⚡` : "-"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-border">
          {published ? (
            <div className="flex items-center gap-2 text-primary font-medium text-sm">
              <Check className="w-4 h-4" />
              Results Published!
            </div>
          ) : (
            <Button
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={publishResults}
              disabled={!selectedTournamentId}
              data-ocid="admin.results.publish.button"
            >
              Publish Results & Distribute Prizes
            </Button>
          )}
        </div>
      </div>

      {/* OCR Screenshot Dialog */}
      <Dialog
        open={ocrOpen}
        onOpenChange={(open) => {
          if (!open) closeOcr();
        }}
      >
        <DialogContent
          className="max-w-lg"
          data-ocid="admin.results.ocr.dialog"
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileImage className="w-4 h-4 text-primary" />
              OCR Screenshot Parser
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Image Preview */}
            {ocrPreviewUrl && (
              <div className="rounded-xl overflow-hidden border border-border max-h-52">
                <img
                  src={ocrPreviewUrl}
                  alt="Screenshot preview"
                  className="w-full h-full object-contain bg-black"
                />
              </div>
            )}

            {/* Instructions */}
            <div className="bg-secondary rounded-xl p-3 text-xs text-muted-foreground space-y-1">
              <p className="font-semibold text-foreground">How to use:</p>
              <ol className="list-decimal list-inside space-y-0.5">
                <li>Take a screenshot of the match results on your device</li>
                <li>
                  Use your phone's built-in OCR (long-press text) to copy the
                  text
                </li>
                <li>
                  Paste or type the results below, then tap "Parse Results"
                </li>
              </ol>
              <p className="mt-2 font-medium">Supported formats:</p>
              <div className="font-mono bg-background rounded p-2 text-[10px] leading-relaxed">
                1 ThunderBolt_K 8<br />
                Rank 1 ThunderBolt_K Kills: 8<br />
                #1 ThunderBolt_K 8 kills
                <br />1 | ThunderBolt_K | 8
              </div>
            </div>

            {/* OCR Text Input */}
            <div className="space-y-1">
              <Label className="text-xs">Paste OCR Text Here</Label>
              <Textarea
                value={ocrText}
                onChange={(e) => setOcrText(e.target.value)}
                placeholder={OCR_PLACEHOLDER}
                className="font-mono text-xs min-h-[100px] resize-none"
                data-ocid="admin.results.ocr.textarea"
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={closeOcr}
                data-ocid="admin.results.ocr.cancel_button"
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground gap-1"
                onClick={handleParseResults}
                data-ocid="admin.results.ocr.confirm_button"
              >
                <Scan className="w-3.5 h-3.5" /> Parse Results
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
