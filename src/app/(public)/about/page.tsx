import type { Metadata } from "next";
import Link from "next/link";
import { Compass, Heart, Users, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "عن Respect Land",
  description: "تعرف على Respect Land ورسالتنا تجاه صناع المحتوى.",
};

const values = [
  {
    icon: <Users className="size-5" />,
    title: "المجتمع",
    desc: "منصة رسمية تجمع صناع المحتوى في مكان واحد.",
  },
  {
    icon: <Heart className="size-5" />,
    title: "الاحترام",
    desc: "نسلّط الضوء على المواهب الحقيقية بإنصاف.",
  },
  {
    icon: <Sparkles className="size-5" />,
    title: "التميز",
    desc: "نعرض أفضل المحتوى وأكثر صناع المحتوى تأثيرًا.",
  },
];

export default function AboutPage() {
  return (
    <div className="container-page py-10 sm:py-14">
      <div className="mx-auto max-w-2xl">
        <div className="mb-10 flex items-center gap-3">
          <span className="flex size-12 items-center justify-center rounded-2xl border border-brand-border bg-brand-surface text-brand-green">
            <Compass className="size-6" />
          </span>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-brand-text">
              عن Respect Land
            </h1>
            <p className="mt-1 text-sm text-brand-muted">A home for creators</p>
          </div>
        </div>

        <div className="space-y-6 text-sm leading-relaxed text-brand-muted sm:text-base">
          <p>
            <b className="text-brand-text">Respect Land</b> هو المكان الرسمي
            لاكتشاف صناع المحتوى المميزين في مجتمعنا. نمنح صناع المحتوى مساحة
            يستحقونها لعرض أعمالهم وبناء جمهورهم.
          </p>
          <p>
            نؤمن أن كل صانع محتوى يستحق الاحترام والظهور. لهذا نوفر منصة نظيفة
            ومنظمة تجمعهم في تصنيفات واضحة وتصنيفات تنافسية عادلة.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {values.map((v) => (
            <div
              key={v.title}
              className="rounded-2xl border border-brand-border bg-brand-surface p-5 text-center"
            >
              <span className="mx-auto mb-3 flex size-10 items-center justify-center rounded-xl border border-brand-border bg-brand-dark text-brand-green">
                {v.icon}
              </span>
              <h3 className="font-semibold text-brand-text">{v.title}</h3>
              <p className="mt-1 text-xs text-brand-muted">{v.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <p className="mb-5 text-brand-muted">هل أنت صانع محتوى؟</p>
          <Link href="/apply">
            <Button size="lg">انضم إلى المجتمع</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}