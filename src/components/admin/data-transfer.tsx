"use client";

import { useState } from "react";
import { Download, Upload, FileJson } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

export function DataTransfer() {
  const { toast } = useToast();
  const [importing, setImporting] = useState(false);

  const exportData = async () => {
    try {
      const res = await fetch("/api/admin/export");
      if (!res.ok) throw new Error("bad");
      const data = await res.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `respect-land-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast("تم تصدير البيانات");
    } catch {
      toast("تعذر التصدير", "error");
    }
  };

  const importData = async (file: File) => {
    setImporting(true);
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      const res = await fetch("/api/admin/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        toast(json.error ?? "فشل الاستيراد", "error");
        return;
      }
      toast(
        `تم الاستيراد: ${json.creatorsAdded} صانع، ${json.categoriesAdded} تصنيف، ${json.skipped} تم تجاوزها`
      );
    } catch {
      toast("ملف غير صالح", "error");
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-brand-border bg-brand-surface p-6">
      <h2 className="mb-1 flex items-center gap-2 text-sm font-semibold text-brand-text">
        <FileJson className="size-4 text-brand-green" />
        تصدير واستيراد البيانات
      </h2>
      <p className="mb-5 text-xs text-brand-muted">
        أنشئ نسخة احتياطية أو استورد بيانات من نسخة سابقة. البيانات الحالية لن يتم
        استبدالها، بل يتم إضافة الجديد وتجاوز المكرر.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button variant="secondary" onClick={exportData}>
          <Download className="size-4" />
          تصدير نسخة احتياطية
        </Button>
        <label className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-brand-border bg-brand-bg/40 px-5 text-sm font-medium text-brand-text transition-colors hover:border-brand-green/40">
          <Upload className="size-4" />
          {importing ? "جارٍ الاستيراد..." : "استيراد البيانات"}
          <input
            type="file"
            accept="application/json"
            className="sr-only"
            disabled={importing}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) importData(f);
              e.target.value = "";
            }}
          />
        </label>
      </div>
    </div>
  );
}