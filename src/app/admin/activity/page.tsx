import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "سجل النشاط", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function ActivityPage() {
  const logs = await prisma.activityLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-brand-text">سجل النشاط</h1>
        <p className="mt-1 text-sm text-brand-muted">
          تتبع الإجراءات الإدارية على المنصة.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-brand-border">
        <table className="w-full min-w-[560px] text-right text-sm">
          <thead>
            <tr className="border-b border-brand-border bg-brand-surface text-xs text-brand-muted">
              <th className="px-4 py-3 font-medium">الإجراء</th>
              <th className="px-4 py-3 font-medium">المسؤول</th>
              <th className="px-4 py-3 font-medium">التاريخ</th>
              <th className="px-4 py-3 font-medium">الوقت</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-b border-brand-border last:border-0 hover:bg-brand-surface">
                <td className="px-4 py-3 text-brand-text">{log.action}</td>
                <td className="px-4 py-3 text-brand-muted">
                  {log.admin ?? log.target ?? "—"}
                </td>
                <td className="px-4 py-3 text-brand-muted">
                  {log.createdAt.toLocaleDateString("ar-EG")}
                </td>
                <td className="px-4 py-3 text-brand-muted" dir="ltr">
                  {log.createdAt.toLocaleTimeString("ar-EG", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-brand-muted">
                  لا يوجد نشاط بعد.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}