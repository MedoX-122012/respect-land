"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  BadgeCheck,
  Star,
  Check,
  ChevronLeft,
  ChevronRight,
  Users,
  SlidersHorizontal,
} from "lucide-react";
import type { CreatorWithCategory } from "@/lib/queries";
import { formatNumber, cn } from "@/lib/utils";
import { PlatformBadge } from "@/components/platform-icon";
import { VerifiedBadge } from "@/components/badges";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { Skeleton } from "@/components/skeleton";

interface PageData {
  creators: CreatorWithCategory[];
  total: number;
  page: number;
  pageSize: number;
}

const STATUS = [
  { value: "all", label: "الكل" },
  { value: "verified", label: "موثق" },
  { value: "featured", label: "مميز" },
  { value: "new", label: "جديد" },
];

const SORTS = [
  { value: "newest", label: "الأحدث" },
  { value: "name", label: "الاسم" },
  { value: "views", label: "المشاهدات" },
  { value: "followers", label: "المتابعون" },
];

export function CreatorsManager({
  categories,
}: {
  categories: { id: string; name: string }[];
}) {
  const { toast } = useToast();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);

  const [data, setData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string[]>([]);
  const [toDelete, setToDelete] = useState<string[]>([]);
  const [bulkCategory, setBulkCategory] = useState("");
  const [showBulkCategory, setShowBulkCategory] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ status, sort, page: String(page) });
    if (q) params.set("q", q);
    try {
      const res = await fetch(`/api/admin/creators?${params}`);
      if (!res.ok) {
        toast("حدث خطأ أثناء التحميل", "error");
        setData({ creators: [], total: 0, page: 1, pageSize: 10 });
        return;
      }
      const json = await res.json();
      setData(json);
    } catch {
      toast("حدث خطأ أثناء التحميل", "error");
    } finally {
      setLoading(false);
    }
  }, [q, status, sort, page, toast]);

  useEffect(() => {
    const t = setTimeout(load, 200);
    return () => clearTimeout(t);
  }, [load]);

  useEffect(() => {
    setSelected([]);
  }, [page, status, sort]);

  const toggle = (id: string) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const allOnPage = data?.creators.every((c) => selected.includes(c.id)) ?? false;
  const toggleAll = () =>
    setSelected(
      allOnPage ? [] : (data?.creators.map((c) => c.id) ?? [])
    );

  const runBulk = async (
    action: string,
    payload: Record<string, unknown> = {}
  ) => {
    const res = await fetch("/api/admin/creators/bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: selected, action, ...payload }),
    });
    if (res.ok) {
      toast("تمت العملية بنجاح");
      setSelected([]);
      setShowBulkCategory(false);
      load();
    } else {
      toast("حدث خطأ", "error");
    }
  };

  const confirmDelete = async () => {
    const res = await fetch("/api/admin/creators/bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: toDelete, action: "delete" }),
    });
    if (res.ok) {
      toast("تم حذف صانع المحتوى");
      setToDelete([]);
      load();
    } else {
      toast("حدث خطأ", "error");
    }
  };

  const toggleField = async (
    id: string,
    field: "verified" | "featured",
    value: boolean
  ) => {
    const res = await fetch(`/api/admin/creators/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: value }),
    });
    if (res.ok) {
      toast(field === "verified" ? "تم تحديث التوثيق" : "تم تحديث المميز");
      load();
    } else {
      toast("حدث خطأ", "error");
    }
  };

  const totalPages = data ? Math.ceil(data.total / data.pageSize) : 1;

  return (
    <div>
      {/* Toolbar */}
      <div className="mb-5 flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-0 flex-1">
            <Search className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-brand-muted" />
            <input
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
              placeholder="ابحث باسم أو اسم مستخدم..."
              className="h-11 w-full rounded-xl border border-brand-border bg-brand-surface pr-10 pl-3 text-sm text-brand-text outline-none focus:border-brand-green"
            />
          </div>
          <Link href="/admin/creators/new">
            <Button>
              <Plus className="size-4" />
              إضافة صانع
            </Button>
          </Link>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="h-10 cursor-pointer rounded-xl border border-brand-border bg-brand-surface px-3 text-sm text-brand-text outline-none"
          >
            {STATUS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setPage(1);
            }}
            className="h-10 cursor-pointer rounded-xl border border-brand-border bg-brand-surface px-3 text-sm text-brand-text outline-none"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          {data && (
            <span className="ml-auto text-sm text-brand-muted">
              {data.total} صانع محتوى
            </span>
          )}
        </div>
      </div>

      {/* Bulk actions */}
      {selected.length > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-2 rounded-xl border border-brand-green/30 bg-brand-green/10 p-3">
          <span className="text-sm text-brand-lime">
            تم تحديد {selected.length}
          </span>
          <button
            onClick={() => runBulk("verify")}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-brand-border bg-brand-surface px-3 text-xs font-medium text-brand-text hover:border-brand-green/40"
          >
            <BadgeCheck className="size-3.5" />
            توثيق
          </button>
          <button
            onClick={() => runBulk("unverify")}
            className="inline-flex h-9 items-center rounded-lg border border-brand-border bg-brand-surface px-3 text-xs font-medium text-brand-text hover:border-brand-green/40"
          >
            إلغاء التوثيق
          </button>
          <button
            onClick={() => runBulk("feature")}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-brand-border bg-brand-surface px-3 text-xs font-medium text-brand-text hover:border-brand-green/40"
          >
            <Star className="size-3.5" />
            تمييز
          </button>
          <button
            onClick={() => runBulk("unfeature")}
            className="inline-flex h-9 items-center rounded-lg border border-brand-border bg-brand-surface px-3 text-xs font-medium text-brand-text hover:border-brand-green/40"
          >
            إزالة التمييز
          </button>
          <button
            onClick={() => setShowBulkCategory((s) => !s)}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-brand-border bg-brand-surface px-3 text-xs font-medium text-brand-text hover:border-brand-green/40"
          >
            <SlidersHorizontal className="size-3.5" />
            تغيير التصنيف
          </button>
          <button
            onClick={() => setToDelete(selected)}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3 text-xs font-medium text-red-400 hover:bg-red-500/20"
          >
            <Trash2 className="size-3.5" />
            حذف
          </button>
          {showBulkCategory && (
            <div className="flex w-full items-center gap-2">
              <select
                value={bulkCategory}
                onChange={(e) => setBulkCategory(e.target.value)}
                className="h-10 flex-1 cursor-pointer rounded-xl border border-brand-border bg-brand-surface px-3 text-sm text-brand-text outline-none"
              >
                <option value="">اختر التصنيف</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <Button
                size="sm"
                disabled={!bulkCategory}
                onClick={() => runBulk("category", { categoryId: bulkCategory })}
              >
                تطبيق
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-brand-border">
        <table className="w-full min-w-[760px] text-right text-sm">
          <thead>
            <tr className="border-b border-brand-border bg-brand-surface text-xs text-brand-muted">
              <th className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={allOnPage}
                  onChange={toggleAll}
                  className="size-4 accent-brand-green"
                  aria-label="تحديد الكل"
                />
              </th>
              <th className="px-4 py-3 font-medium">صانع المحتوى</th>
              <th className="px-4 py-3 font-medium">التصنيف</th>
              <th className="px-4 py-3 font-medium">المنصات</th>
              <th className="px-4 py-3 font-medium">الحالة</th>
              <th className="px-4 py-3 font-medium">المشاهدات</th>
              <th className="px-4 py-3 font-medium">تاريخ الإضافة</th>
              <th className="px-4 py-3 font-medium">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="border-b border-brand-border last:border-0">
                    <td className="px-4 py-4" colSpan={8}>
                      <Skeleton className="h-8 w-full" />
                    </td>
                  </tr>
                ))
              : data?.creators.map((c) => (
                  <tr
                    key={c.id}
                    className={cn(
                      "border-b border-brand-border transition-colors last:border-0 hover:bg-brand-surface",
                      selected.includes(c.id) && "bg-brand-green/5"
                    )}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selected.includes(c.id)}
                        onChange={() => toggle(c.id)}
                        className="size-4 accent-brand-green"
                        aria-label={`تحديد ${c.name}`}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-brand-dark">
                          {c.avatar ? (
                            <Image
                              src={c.avatar}
                              alt={c.name}
                              width={40}
                              height={40}
                              className="size-full object-cover"
                            />
                          ) : (
                            <span className="text-sm font-bold text-brand-muted">
                              {c.name.charAt(0)}
                            </span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="flex items-center gap-1.5 truncate font-medium text-brand-text">
                            {c.name}
                            {c.verified && <VerifiedBadge />}
                          </p>
                          <p className="truncate text-xs text-brand-muted" dir="ltr">
                            @{c.username}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-brand-muted">
                      {c.category?.name ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5">
                        {Array.isArray(c.platforms) &&
                          (c.platforms as { key: string }[])
                            .slice(0, 4)
                            .map((p) => (
                              <PlatformBadge
                                key={p.key}
                                platform={p.key}
                                className="size-6 rounded-md"
                              />
                            ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {c.featured && (
                          <span className="rounded-md bg-brand-lime/15 px-2 py-0.5 text-[10px] text-brand-lime">
                            مميز
                          </span>
                        )}
                        {c.isNew && (
                          <span className="rounded-md bg-brand-green/15 px-2 py-0.5 text-[10px] text-brand-green">
                            جديد
                          </span>
                        )}
                        {c.trending && (
                          <span className="rounded-md bg-brand-surface-2 px-2 py-0.5 text-[10px] text-brand-muted">
                            رائج
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 tabular-nums text-brand-muted">
                      {formatNumber(c.views)}
                    </td>
                    <td className="px-4 py-3 text-xs text-brand-muted">
                      {new Date(c.createdAt).toLocaleDateString("ar-EG")}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Link
                          href={`/creators/${c.username}`}
                          target="_blank"
                          className="flex size-8 items-center justify-center rounded-lg text-brand-muted transition-colors hover:bg-brand-border hover:text-brand-text"
                          title="معاينة"
                        >
                          <Eye className="size-4" />
                        </Link>
                        <Link
                          href={`/admin/creators/${c.id}/edit`}
                          className="flex size-8 items-center justify-center rounded-lg text-brand-muted transition-colors hover:bg-brand-border hover:text-brand-text"
                          title="تعديل"
                        >
                          <Pencil className="size-4" />
                        </Link>
                        <button
                          onClick={() => toggleField(c.id, "verified", !c.verified)}
                          className={cn(
                            "flex size-8 items-center justify-center rounded-lg transition-colors",
                            c.verified
                              ? "text-brand-green"
                              : "text-brand-muted hover:bg-brand-border"
                          )}
                          title="توثيق"
                        >
                          <BadgeCheck className="size-4" />
                        </button>
                        <button
                          onClick={() => toggleField(c.id, "featured", !c.featured)}
                          className={cn(
                            "flex size-8 items-center justify-center rounded-lg transition-colors",
                            c.featured
                              ? "text-brand-lime"
                              : "text-brand-muted hover:bg-brand-border"
                          )}
                          title="تمييز"
                        >
                          <Star className="size-4" />
                        </button>
                        <button
                          onClick={() => setToDelete([c.id])}
                          className="flex size-8 items-center justify-center rounded-lg text-brand-muted transition-colors hover:bg-red-500/10 hover:text-red-400"
                          title="حذف"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {/* Empty */}
      {!loading && data?.creators.length === 0 && (
        <div className="mt-4 flex flex-col items-center justify-center rounded-2xl border border-dashed border-brand-border py-16 text-center">
          <Users className="mb-3 size-8 text-brand-muted" />
          <p className="text-brand-text">لم نجد صناع محتوى مطابقين.</p>
        </div>
      )}

      {/* Pagination */}
      {data && data.total > data.pageSize && (
        <div className="mt-5 flex items-center justify-center gap-3">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="flex size-10 items-center justify-center rounded-xl border border-brand-border bg-brand-surface text-brand-text disabled:opacity-40"
            aria-label="السابق"
          >
            <ChevronRight className="size-4" />
          </button>
          <span className="text-sm text-brand-muted">
            صفحة {data.page} من {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="flex size-10 items-center justify-center rounded-xl border border-brand-border bg-brand-surface text-brand-text disabled:opacity-40"
            aria-label="التالي"
          >
            <ChevronLeft className="size-4" />
          </button>
        </div>
      )}

      {/* Delete modal */}
      <Modal
        open={toDelete.length > 0}
        onClose={() => setToDelete([])}
        title="هل أنت متأكد من حذف صانع المحتوى؟"
        destructive
        footer={
          <>
            <Button variant="secondary" onClick={() => setToDelete([])}>
              إلغاء
            </Button>
            <Button
              onClick={confirmDelete}
              className="bg-red-600 text-white hover:bg-red-500"
            >
              <Check className="size-4" />
              تأكيد الحذف
            </Button>
          </>
        }
      >
        <p>
          سيتم حذف {toDelete.length > 1 ? `${toDelete.length} صانعي محتوى` : "هذا صانع المحتوى"} نهائيًا.
          لا يمكن التراجع عن هذا الإجراء.
        </p>
      </Modal>
    </div>
  );
}