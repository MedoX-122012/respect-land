"use client";

import { LogoMark } from "@/components/logo";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className="flex min-h-screen items-center justify-center bg-brand-bg px-6 text-center font-sans text-brand-text antialiased">
        <div>
          <div className="flex justify-center">
            <LogoMark size={44} />
          </div>
          <h1 className="mt-6 text-2xl font-bold">حدث خطأ غير متوقع</h1>
          <p className="mt-2 max-w-md text-sm text-brand-muted">
            تعذر تحميل الصفحة الآن. حاول مرة أخرى بعد قليل.
          </p>
          <button
            onClick={reset}
            className="mt-8 inline-flex h-11 items-center justify-center rounded-xl bg-brand-green px-6 text-sm font-semibold text-brand-bg transition-colors hover:bg-brand-lime"
          >
            إعادة المحاولة
          </button>
        </div>
      </body>
    </html>
  );
}