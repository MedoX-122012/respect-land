"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  ChevronUp,
  ChevronDown,
  Users,
} from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Field } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { Skeleton } from "@/components/skeleton";

interface Cat {
  id: string;
  name: string;
  slug: string;
  icon?: string | null;
  description?: string | null;
  order: number;
  _count: { creators: number };
}

const ICONS = [
  "gamepad", "radio", "youtube", "music", "twitch",
  "blocks", "dice", "sparkles", "star",
];

export function CategoriesManager() {
  const { toast } = useToast();
  const [cats, setCats] = useState<Cat[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Cat | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<Cat | null>(null);
  const [reassignTo, setReassignTo] = useState("");

  const [form, setForm] = useState({ name: "", icon: "star", description: "" });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      setCats(data.categories);
    } catch {
      toast("حدث خطأ", "error");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setForm({ name: "", icon: "star", description: "" });
    setCreating(true);
  };

  const openEdit = (c: Cat) => {
    setForm({ name: c.name, icon: c.icon ?? "star", description: c.description ?? "" });
    setEditing(c);
  };

  const save = async () => {
    if (creating) {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast("تم إنشاء التصنيف");
        setCreating(false);
        load();
      } else {
        toast("تعذر إنشاء التصنيف", "error");
      }
    } else if (editing) {
      const res = await fetch(`/api/admin/categories/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast("تم تعديل التصنيف");
        setEditing(null);
        load();
      } else {
        toast("تعذر التعديل", "error");
      }
    }
  };

  const move = async (c: Cat, dir: -1 | 1) => {
    const sorted = [...cats].sort((a, b) => a.order - b.order);
    const idx = sorted.findIndex((x) => x.id === c.id);
    const target = sorted[idx + dir];
    if (!target) return;
    await Promise.all([
      fetch(`/api/admin/categories/${c.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: target.order }),
      }),
      fetch(`/api/admin/categories/${target.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: c.order }),
      }),
    ]);
    load();
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    const res = await fetch(`/api/admin/categories/${deleting.id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reassignTo: reassignTo || null }),
    });
    const data = await res.json();
    if (res.ok) {
      toast("تم حذف التصنيف");
      setDeleting(null);
      setReassignTo("");
      load();
    } else {
      toast(data.error ?? "تعذر الحذف", "error");
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <Button onClick={openCreate}>
          <Plus className="size-4" />
          إضافة تصنيف
        </Button>
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-brand-border">
          {cats.map((c, i) => (
            <div
              key={c.id}
              className="flex items-center gap-4 border-b border-brand-border bg-brand-surface/40 p-4 transition-colors last:border-0 hover:bg-brand-surface"
            >
              <div className="flex flex-col gap-0.5">
                <button
                  onClick={() => move(c, -1)}
                  disabled={i === 0}
                  className="text-brand-muted transition-colors hover:text-brand-green disabled:opacity-30"
                  aria-label="تحريك لأعلى"
                >
                  <ChevronUp className="size-4" />
                </button>
                <button
                  onClick={() => move(c, 1)}
                  disabled={i === cats.length - 1}
                  className="text-brand-muted transition-colors hover:text-brand-green disabled:opacity-30"
                  aria-label="تحريك لأسفل"
                >
                  <ChevronDown className="size-4" />
                </button>
              </div>
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-brand-border bg-brand-dark text-brand-green">
                <span className="text-lg">{ICON_GLYPH[c.icon ?? "star"] ?? "•"}</span>
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-brand-text">{c.name}</p>
                <p className="flex items-center gap-2 text-xs text-brand-muted">
                  <span dir="ltr">{c.slug}</span>
                  <span className="flex items-center gap-1">
                    <Users className="size-3" />
                    {c._count.creators}
                  </span>
                </p>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => openEdit(c)}
                  className="flex size-8 items-center justify-center rounded-lg text-brand-muted transition-colors hover:bg-brand-border hover:text-brand-text"
                  title="تعديل"
                >
                  <Pencil className="size-4" />
                </button>
                <button
                  onClick={() => {
                    setDeleting(c);
                    setReassignTo("");
                  }}
                  className="flex size-8 items-center justify-center rounded-lg text-brand-muted transition-colors hover:bg-red-500/10 hover:text-red-400"
                  title="حذف"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit modal */}
      <Modal
        open={creating || !!editing}
        onClose={() => {
          setCreating(false);
          setEditing(null);
        }}
        title={creating ? "إضافة تصنيف" : "تعديل تصنيف"}
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                setCreating(false);
                setEditing(null);
              }}
            >
              إلغاء
            </Button>
            <Button onClick={save}>حفظ</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="الاسم">
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Field>
          <Field label="الأيقونة">
            <div className="flex flex-wrap gap-2">
              {ICONS.map((ic) => (
                <button
                  key={ic}
                  onClick={() => setForm({ ...form, icon: ic })}
                  className={
                    form.icon === ic
                      ? "flex size-10 items-center justify-center rounded-xl border border-brand-green/40 bg-brand-green/10 text-brand-lime"
                      : "flex size-10 items-center justify-center rounded-xl border border-brand-border bg-brand-bg/40 text-brand-muted hover:text-brand-text"
                  }
                >
                  {ICON_GLYPH[ic] ?? ic}
                </button>
              ))}
            </div>
          </Field>
          <Field label="الوصف">
            <Textarea
              rows={2}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </Field>
        </div>
      </Modal>

      {/* Delete modal */}
      <Modal
        open={!!deleting}
        onClose={() => setDeleting(null)}
        title="هل أنت متأكد من حذف التصنيف؟"
        destructive
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleting(null)}>
              إلغاء
            </Button>
            <Button onClick={confirmDelete} className="bg-red-600 text-white hover:bg-red-500">
              تأكيد الحذف
            </Button>
          </>
        }
      >
        {deleting && deleting._count.creators > 0 && (
          <div className="space-y-3">
            <p>
              يحتوي هذا التصنيف على {deleting._count.creators} صانع محتوى. اختر تصنيفًا
              لنقلهم إليه أو اتركه فارغًا ليصبحوا بدون تصنيف.
            </p>
            <select
              value={reassignTo}
              onChange={(e) => setReassignTo(e.target.value)}
              className="h-11 w-full cursor-pointer rounded-xl border border-brand-border bg-brand-bg/50 px-3 text-sm text-brand-text outline-none"
            >
              <option value="">بدون تصنيف</option>
              {cats
                .filter((c) => c.id !== deleting.id)
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
            </select>
          </div>
        )}
        {deleting && deleting._count.creators === 0 && (
          <p>لا يمكن التراجع عن هذا الإجراء.</p>
        )}
      </Modal>
    </div>
  );
}

const ICON_GLYPH: Record<string, string> = {
  gamepad: "🎮",
  radio: "📻",
  youtube: "▶️",
  music: "🎵",
  twitch: "🖥️",
  blocks: "🧱",
  dice: "🎲",
  sparkles: "✨",
  star: "⭐",
};