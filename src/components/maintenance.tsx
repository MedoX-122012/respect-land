import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { getSiteSettings } from "@/lib/queries";

export async function MaintenancePage() {
  let name = "Respect Land";
  try {
    const s = await getSiteSettings();
    name = s.siteName;
  } catch {
    name = "Respect Land";
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
      <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black,transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,197,94,0.12),transparent_55%)]" />
      <div className="relative flex flex-col items-center">
        <Logo size={56} showText={false} />
        <h1 className="mt-8 text-3xl font-extrabold tracking-tight text-brand-text sm:text-4xl">
          {name} يعود إليكم قريبًا.
        </h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-brand-muted sm:text-base">
          نعمل حاليًا على تحسين المنصة لتقديم تجربة أفضل لصناع المحتوى والزوار.
        </p>
        <div className="mt-8 flex items-center gap-2">
          <span className="flex size-2 rounded-full bg-brand-green animate-pulse" />
          <span className="flex size-2 rounded-full bg-brand-green/60 animate-pulse" style={{ animationDelay: "0.2s" }} />
          <span className="flex size-2 rounded-full bg-brand-green/30 animate-pulse" style={{ animationDelay: "0.4s" }} />
        </div>
      </div>
    </div>
  );
}