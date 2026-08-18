"use client";

import Link from "next/link";
import { LogoMark } from "@/components/logo";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="relative flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <LogoMark size={44} />
      <h1 className="mt-6 text-2xl font-bold text-brand-text">
        حدث خطأ غير متوقع
      </h1>
      <p className="mt-2 max-w-md text-sm text-brand-muted">
        تعذر تحميل هذه الصفحة الآن. حاول مرة أخرى بعد قليل.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button onClick={reset}>إعادة المحاولة</Button>
        <Link href="/">
          <Button variant="secondary">العودة للرئيسية</Button>
        </Link>
      </div>
    </div>
  );
}