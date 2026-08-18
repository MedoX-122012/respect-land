"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Megaphone } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Field } from "@/components/ui/input";
import { Switch } from "@/components/ui/select";
import { useToast } from "@/components/ui/toast";
import { Skeleton } from "@/components/skeleton";

interface Ann {
  id: string;
  title: string;
  description?: string | null;
  type: string;
  active: boolean;
  createdAt: string;
}

export function AnnouncementsManager() {
  const { toast } = useToast();
  const [items, setItems] = useState<Ann[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<Ann | null>(null);
  const [form, setForm] = useState({ title: "", description: "", type: "info", active: true });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/announcements");
      const data = await res.json();
      setItems(data.announcements);
    } catch {
      toast("حدث خطأ", "error");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  const save = async () => {
    const url = creating
      ? "/api/admin/announcements"
      : `/api/admin/announcements?id=${editing?.id}`;
    const method = creating ? "POST" : "PUT";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      toast(creating ? "تم إنشاء الإعلان" : "تم تحديث الإعلان");
      setCreating(false);
      setEditing(null);
      load();
    } else {
      toast("حدث خطأ", "error");
    }
  };

  const remove = async (id: string) => {
    await fetch(`/api/admin/announcements?id=${id}`, { method: "DELETE" });
    toast("تم حذف الإعلان");
    load();
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <Button size="sm" onClick={() => {
          setForm({ title: "", description: "", type: "info", active: true });
          setCreating(true);
        }}>
          <Plus className="size-4" />
          إضافة إعلان
        </Button>
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-brand-border p-6 text-center text-sm text-brand-muted">
          لا توجد إعلانات.
        </p>
      ) : (
        <div className="space-y-2">
          {items.map((a) => (
            <div
              key={a.id}
              className="flex items-center gap-3 rounded-xl border border-brand-border bg-brand-bg/40 p-3"
            >
              <Megaphone className="size-4 shrink-0 text-brand-green" />
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-2 truncate text-sm font-medium text-brand-text">
                  {a.title}
                  <span
                    className={
                      a.active
                        ? "rounded-md bg-brand-green/15 px-1.5 py-0.5 text-[10px] text-brand-green"
                        : "rounded-md bg-brand-border px-1.5 py-0.5 text-[10px] text-brand-muted"
                    }
                  >
                    {a.active ? "نشط" : "غير نشط"}
                  </span>
                </p>
                {a.description && (
                  <p className="truncate text-xs text-brand-muted">{a.description}</p>
                )}
              </div>
              <button
                onClick={() => {
                  setEditing(a);
                  setForm({ title: a.title, description: a.description ?? "", type: a.type, active: a.active });
                }}
                className="flex size-8 items-center justify-center rounded-lg text-brand-muted hover:bg-brand-border hover:text-brand-text"
                aria-label="تعديل"
              >
                <Pencil className="size-4" />
              </button>
              <button
                onClick={() => remove(a.id)}
                className="flex size-8 items-center justify-center rounded-lg text-brand-muted hover:bg-red-500/10 hover:text-red-400"
                aria-label="حذف"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={creating || !!editing}
        onClose={() => {
          setCreating(false);
          setEditing(null);
        }}
        title={creating ? "إضافة إعلان" : "تعديل إعلان"}
        footer={
          <>
            <Button variant="secondary" onClick={() => { setCreating(false); setEditing(null); }}>
              إلغاء
            </Button>
            <Button onClick={save}>حفظ</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="العنوان">
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </Field>
          <Field label="الوصف">
            <Textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </Field>
          <Field label="النوع">
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="h-11 w-full cursor-pointer rounded-xl border border-brand-border bg-brand-bg/50 px-3 text-sm text-brand-text outline-none"
            >
              <option value="info">معلومات</option>
              <option value="success">نجاح</option>
              <option value="warning">تنبيه</option>
            </select>
          </Field>
          <label className="flex items-center justify-between">
            <span className="text-sm text-brand-text">نشط</span>
            <Switch checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
          </label>
        </div>
      </Modal>
    </div>
  );
}