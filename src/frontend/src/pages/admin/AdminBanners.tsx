import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import {
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  ImageUp,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import ConfirmModal from "../../components/ConfirmModal";
import { useGameData } from "../../hooks/useGameData";

export default function AdminBanners() {
  const game = useGameData();
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", imageUrl: "", link: "/" });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sortedBanners = [...game.banners].sort((a, b) => a.order - b.order);

  const moveUp = (index: number) => {
    if (index === 0) return;
    const prev = sortedBanners[index - 1];
    const curr = sortedBanners[index];
    game.updateBanner(prev.id, { order: curr.order });
    game.updateBanner(curr.id, { order: prev.order });
  };

  const moveDown = (index: number) => {
    if (index === sortedBanners.length - 1) return;
    const next = sortedBanners[index + 1];
    const curr = sortedBanners[index];
    game.updateBanner(next.id, { order: curr.order });
    game.updateBanner(curr.id, { order: next.order });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    // Show an object URL preview immediately
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // Simulate progress while reading file
    const progressInterval = setInterval(() => {
      setUploadProgress((p) => {
        if (p >= 85) {
          clearInterval(progressInterval);
          return p;
        }
        return p + 15;
      });
    }, 80);

    const reader = new FileReader();
    reader.onload = (ev) => {
      clearInterval(progressInterval);
      setUploadProgress(100);
      const dataUrl = ev.target?.result as string;
      setForm((p) => ({ ...p, imageUrl: dataUrl }));
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 400);
      toast.success("Image loaded! Ready to save.");
    };
    reader.onerror = () => {
      clearInterval(progressInterval);
      setIsUploading(false);
      setUploadProgress(0);
      toast.error("Failed to read image.");
    };
    reader.readAsDataURL(file);
    // Reset so same file can be re-selected
    e.target.value = "";
  };

  const handleCreate = () => {
    if (!form.title.trim() || !form.imageUrl.trim()) {
      toast.error("Title and image required");
      return;
    }
    const maxOrder = Math.max(0, ...game.banners.map((b) => b.order));
    game.addBanner({
      title: form.title,
      imageUrl: form.imageUrl,
      link: form.link,
      isVisible: true,
      order: maxOrder + 1,
    });
    toast.success("Banner added!");
    setShowForm(false);
    setForm({ title: "", imageUrl: "", link: "/" });
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      setShowForm(false);
      setForm({ title: "", imageUrl: "", link: "/" });
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">
            Banner Management
          </h1>
          <p className="text-sm text-muted-foreground">
            {game.banners.length} banners
          </p>
        </div>
        <Button
          className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
          onClick={() => setShowForm(true)}
          data-ocid="admin.banners.create.button"
        >
          <Plus className="w-4 h-4" /> Add Banner
        </Button>
      </div>

      <div className="space-y-3">
        {sortedBanners.map((banner, i) => (
          <div
            key={banner.id}
            className="game-card p-3 flex items-center gap-3"
            data-ocid={`admin.banners.item.${i + 1}`}
          >
            {/* Thumbnail */}
            <div className="w-20 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-secondary">
              <img
                src={banner.imageUrl}
                alt={banner.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-foreground">
                {banner.title}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {banner.link}
              </p>
              <p className="text-xs text-muted-foreground">
                Order: {banner.order}
              </p>
            </div>

            <div className="flex items-center gap-1 flex-shrink-0">
              {/* Reorder */}
              <div className="flex flex-col gap-0.5">
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-6 h-6"
                  onClick={() => moveUp(i)}
                  disabled={i === 0}
                  data-ocid={`admin.banners.move_up.${i + 1}`}
                >
                  <ChevronUp className="w-3 h-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-6 h-6"
                  onClick={() => moveDown(i)}
                  disabled={i === sortedBanners.length - 1}
                  data-ocid={`admin.banners.move_down.${i + 1}`}
                >
                  <ChevronDown className="w-3 h-3" />
                </Button>
              </div>

              {/* Visibility */}
              <Button
                variant="ghost"
                size="icon"
                className="w-7 h-7"
                onClick={() =>
                  game.updateBanner(banner.id, { isVisible: !banner.isVisible })
                }
                data-ocid={`admin.banners.toggle.${i + 1}`}
              >
                {banner.isVisible ? (
                  <Eye className="w-3.5 h-3.5 text-primary" />
                ) : (
                  <EyeOff className="w-3.5 h-3.5 text-muted-foreground" />
                )}
              </Button>

              <Switch
                checked={banner.isVisible}
                onCheckedChange={(v) =>
                  game.updateBanner(banner.id, { isVisible: v })
                }
                data-ocid={`admin.banners.switch.${i + 1}`}
              />

              <Button
                variant="ghost"
                size="icon"
                className="w-7 h-7 text-destructive hover:text-destructive"
                onClick={() => setDeleteId(banner.id)}
                data-ocid={`admin.banners.delete.${i + 1}`}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={showForm} onOpenChange={handleDialogClose}>
        <DialogContent data-ocid="admin.banners.form.dialog">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ImageUp className="w-4 h-4" />
              Add Banner
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
                placeholder="Banner title"
                data-ocid="admin.banners.title.input"
              />
            </div>

            {/* Image Upload Section */}
            <div className="space-y-2">
              <Label className="text-xs">Banner Image</Label>

              {/* Upload Zone */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileSelect}
                data-ocid="admin.banners.image.upload_button"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full min-h-[80px] rounded-xl border-2 border-dashed border-border hover:border-primary/60 transition-colors flex flex-col items-center justify-center gap-2 cursor-pointer bg-secondary/40 active:scale-[0.99]"
                data-ocid="admin.banners.image.dropzone"
              >
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-h-[120px] w-full object-contain rounded-lg"
                  />
                ) : (
                  <>
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Upload className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-xs text-muted-foreground text-center px-4">
                      <span className="text-primary font-semibold">
                        Upload from device
                      </span>{" "}
                      or take a photo
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      JPG, PNG, WebP supported
                    </span>
                  </>
                )}
              </button>

              {/* Upload Progress */}
              {isUploading && (
                <div
                  className="space-y-1"
                  data-ocid="admin.banners.upload.loading_state"
                >
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                    <span>Reading image…</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-1" />
                </div>
              )}

              {/* OR separator */}
              <div className="flex items-center gap-2">
                <div className="flex-1 h-px bg-border" />
                <span className="text-[10px] text-muted-foreground font-medium">
                  OR
                </span>
                <div className="flex-1 h-px bg-border" />
              </div>

              {/* URL Input */}
              <Input
                value={form.imageUrl.startsWith("data:") ? "" : form.imageUrl}
                onChange={(e) =>
                  setForm((p) => ({ ...p, imageUrl: e.target.value }))
                }
                placeholder="Paste image URL: https://..."
                data-ocid="admin.banners.image_url.input"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Link (target page)</Label>
              <Input
                value={form.link}
                onChange={(e) =>
                  setForm((p) => ({ ...p, link: e.target.value }))
                }
                placeholder="/tournaments"
                data-ocid="admin.banners.link.input"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => handleDialogClose(false)}
                data-ocid="admin.banners.cancel.button"
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={handleCreate}
                disabled={isUploading}
                data-ocid="admin.banners.save.button"
              >
                Add
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
            game.deleteBanner(deleteId);
            toast.success("Banner deleted");
            setDeleteId(null);
          }
        }}
        title="Delete Banner"
        description="Delete this banner permanently?"
        confirmLabel="Delete"
        variant="destructive"
      />
    </div>
  );
}
