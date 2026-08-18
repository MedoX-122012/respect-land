import type { Metadata } from "next";
import Link from "next/link";
import { LogoMark } from "@/components/logo";
import { AdminLoginForm } from "@/components/admin-login-form";

export const metadata: Metadata = {
  title: "تسجيل الدخول",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center px-6 py-16">
      <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black,transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,197,94,0.1),transparent_55%)]" />
      <div className="relative w-full max-w-md rounded-2xl border border-brand-border bg-brand-surface p-8 shadow-2xl animate-fade-up">
        <div className="mb-7 flex flex-col items-center text-center">
          <LogoMark size={48} />
          <h1 className="mt-4 text-xl font-bold text-brand-text">
            لوحة تحكم Respect Land
          </h1>
          <p className="mt-1 text-sm text-brand-muted">
            سجّل الدخول لإدارة المحتوى.
          </p>
        </div>
        <AdminLoginForm />
        <p className="mt-6 text-center text-sm text-brand-muted">
          ليس لديك حساب؟{" "}
          <Link href="/register" className="font-medium text-brand-green hover:text-brand-lime">
            أنشئ حسابًا
          </Link>
        </p>
      </div>
    </div>
  );
}