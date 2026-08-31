"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  UserPlus,
  Shield,
  ShieldOff,
  Check,
  Loader2,
} from "lucide-react";
import { Input, Field } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

interface User {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  createdAt: string;
}

export function UsersManager() {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState<User | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "ADMIN" as "ADMIN" | "USER",
  });
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const json = await res.json();
        setUsers(json.users);
        setCurrentUserId(json.currentUserId);
      } else {
        toast("حدث خطأ أثناء التحميل", "error");
      }
    } catch {
      toast("حدث خطأ أثناء التحميل", "error");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors(data.error ?? {});
        toast("تحقق من الحقول", "error");
        return;
      }
      toast("تمت إضافة المستخدم بنجاح");
      setForm({ name: "", email: "", password: "", role: "ADMIN" });
      setShowForm(false);
      load();
    } catch {
      toast("حدث خطأ أثناء الحفظ", "error");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: toDelete.id }),
      });
      const data = await res.json();
      if (res.ok) {
        toast("تم حذف المستخدم");
        setToDelete(null);
        load();
      } else {
        toast(data.error ?? "حدث خطأ", "error");
      }
    } catch {
      toast("حدث خطأ", "error");
    } finally {
      setDeleting(false);
    }
  };

  const toggleRole = async (u: User) => {
    const newRole = u.role === "ADMIN" ? "USER" : "ADMIN";

    // Prevent self-demotion
    if (u.id === currentUserId && newRole !== "ADMIN") {
      toast("لا يمكنك تغيير صلاحيتك الخاصة", "error");
      return;
    }

    setTogglingId(u.id);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: u.id, role: newRole }),
      });
      const data = await res.json();
      if (res.ok) {
        toast(`تم تغيير صلاحية ${u.name ?? u.email} إلى ${newRole}`);
        load();
      } else {
        toast(data.error ?? "حدث خطأ", "error");
      }
    } catch {
      toast("حدث خطأ", "error");
    } finally {
      setTogglingId(null);
    }
  };

  const err = (k: string) => errors[k]?.[0];

  return (
    <div>
      <div className="mb-5 flex items-center gap-3">
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="size-4" />
          إضافة مستخدم
        </Button>
        <span className="text-sm text-brand-muted">
          {users.length} مستخدم
        </span>
      </div>

      {/* Create form */}
      {showForm && (
        <form
          onSubmit={submit}
          className="mb-6 rounded-2xl border border-brand-border bg-brand-surface p-6"
        >
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-brand-text">
            <UserPlus className="size-4" />
            مستخدم جديد
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="الاسم">
              <Input
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              />
              {err("name") && (
                <span className="text-xs text-red-400">{err("name")}</span>
              )}
            </Field>
            <Field label="البريد الإلكتروني">
              <Input
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm((p) => ({ ...p, email: e.target.value }))
                }
                dir="ltr"
              />
              {err("email") && (
                <span className="text-xs text-red-400">{err("email")}</span>
              )}
            </Field>
            <Field label="كلمة المرور">
              <Input
                type="password"
                value={form.password}
                onChange={(e) =>
                  setForm((p) => ({ ...p, password: e.target.value }))
                }
                dir="ltr"
              />
              {err("password") && (
                <span className="text-xs text-red-400">{err("password")}</span>
              )}
            </Field>
            <Field label="الصلاحية">
              <select
                value={form.role}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    role: e.target.value as "ADMIN" | "USER",
                  }))
                }
                className="h-11 w-full cursor-pointer rounded-xl border border-brand-border bg-brand-bg/50 px-3 text-sm text-brand-text outline-none"
              >
                <option value="ADMIN">مدير (ADMIN)</option>
                <option value="USER">مستخدم (USER)</option>
              </select>
            </Field>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <Button type="submit" isLoading={saving}>
              <Check className="size-4" />
              إنشاء
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setShowForm(false);
                setErrors({});
              }}
            >
              إلغاء
            </Button>
          </div>
        </form>
      )}

      {/* Users table */}
      <div className="overflow-x-auto rounded-2xl border border-brand-border">
        <table className="w-full text-right text-sm">
          <thead>
            <tr className="border-b border-brand-border bg-brand-surface text-xs text-brand-muted">
              <th className="px-4 py-3 font-medium">الاسم</th>
              <th className="px-4 py-3 font-medium">البريد</th>
              <th className="px-4 py-3 font-medium">الصلاحية</th>
              <th className="px-4 py-3 font-medium">تاريخ الإنشاء</th>
              <th className="px-4 py-3 font-medium">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <tr
                    key={i}
                    className="border-b border-brand-border last:border-0"
                  >
                    <td colSpan={5} className="px-4 py-4">
                      <div className="h-6 w-full animate-pulse rounded bg-brand-surface" />
                    </td>
                  </tr>
                ))
              : users.map((u) => {
                  const isSelf = u.id === currentUserId;
                  const isToggling = togglingId === u.id;
                  return (
                    <tr
                      key={u.id}
                      className="border-b border-brand-border last:border-0 hover:bg-brand-surface"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-brand-text">
                            {u.name ?? "—"}
                          </span>
                          {isSelf && (
                            <span className="rounded-md bg-brand-green/15 px-1.5 py-0.5 text-[9px] text-brand-green">
                              أنت
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-brand-muted" dir="ltr">
                        {u.email ?? "—"}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => toggleRole(u)}
                          disabled={isToggling || (isSelf && u.role === "ADMIN")}
                          className={cn(
                            "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-medium transition-colors",
                            u.role === "ADMIN"
                              ? "bg-brand-green/15 text-brand-green hover:bg-brand-green/25"
                              : "bg-brand-surface-2 text-brand-muted hover:bg-brand-surface",
                            (isToggling || (isSelf && u.role === "ADMIN")) &&
                              "cursor-not-allowed opacity-60"
                          )}
                          title={
                            isSelf && u.role === "ADMIN"
                              ? "لا يمكنك تغيير صلاحيتك"
                              : "اضغط لتغيير الصلاحية"
                          }
                        >
                          {isToggling ? (
                            <Loader2 className="size-3 animate-spin" />
                          ) : u.role === "ADMIN" ? (
                            <Shield className="size-3" />
                          ) : (
                            <ShieldOff className="size-3" />
                          )}
                          {u.role}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-xs text-brand-muted">
                        {new Date(u.createdAt).toLocaleDateString("ar-EG")}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setToDelete(u)}
                          disabled={isSelf}
                          className={cn(
                            "flex size-8 items-center justify-center rounded-lg transition-colors",
                            isSelf
                              ? "cursor-not-allowed text-brand-border"
                              : "text-brand-muted hover:bg-red-500/10 hover:text-red-400"
                          )}
                          title={isSelf ? "لا يمكنك حذف حسابك" : "حذف"}
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
          </tbody>
        </table>
      </div>

      {users.length === 0 && !loading && (
        <div className="mt-4 flex flex-col items-center justify-center rounded-2xl border border-dashed border-brand-border py-16 text-center">
          <Shield className="mb-3 size-8 text-brand-muted" />
          <p className="text-brand-text">لا يوجد مستخدمون بعد.</p>
        </div>
      )}

      {/* Delete confirmation modal */}
      <Modal
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        title="هل أنت متأكد من حذف المستخدم؟"
        destructive
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setToDelete(null)}
              disabled={deleting}
            >
              إلغاء
            </Button>
            <Button
              onClick={confirmDelete}
              isLoading={deleting}
              className="bg-red-600 text-white hover:bg-red-500"
            >
              <Check className="size-4" />
              تأكيد الحذف
            </Button>
          </>
        }
      >
        <p>
          سيتم حذف المستخدم <strong>{toDelete?.name ?? toDelete?.email}</strong>{" "}
          نهائيًا. لا يمكن التراجع عن هذا الإجراء.
        </p>
      </Modal>
    </div>
  );
}
