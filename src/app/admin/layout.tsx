import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AdminShell } from "@/components/admin/admin-shell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const role = (session.user as { role?: string } | undefined)?.role;
  if (role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-brand-bg">
      <AdminShell>{children}</AdminShell>
    </div>
  );
}