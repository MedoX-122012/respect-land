import Link from "next/link";
import { Compass, ArrowRight } from "lucide-react";
import { LogoMark } from "@/components/logo";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
      <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black,transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,197,94,0.1),transparent_55%)]" />
      <div className="relative flex flex-col items-center">
        <LogoMark size={64} />
        <h1 className="mt-8 text-6xl font-extrabold tracking-tight text-brand-green sm:text-7xl">
          404
        </h1>
        <p className="mt-4 max-w-md text-lg font-semibold text-brand-text sm:text-xl">
          يبدو أنك خرجت عن حدود Respect Land.
        </p>
        <p className="mt-2 max-w-sm text-sm text-brand-muted">
          الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex h-12 items-center gap-2 rounded-xl bg-brand-green px-6 text-sm font-medium text-brand-bg transition-all hover:bg-brand-lime"
        >
          <Compass className="size-4" />
          العودة للرئيسية
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}