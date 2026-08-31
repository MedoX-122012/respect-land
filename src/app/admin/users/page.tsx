import type { Metadata } from "next";
import { UsersManager } from "@/components/admin/users-manager";

export const metadata: Metadata = {
  title: "إدارة المستخدمين",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

export default function AdminUsersPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-brand-text">المستخدمون</h1>
        <p className="mt-1 text-sm text-brand-muted">
          إدارة حسابات المستخدمين وصلاحياتهم.
        </p>
      </div>
      <UsersManager />
    </div>
  );
}
