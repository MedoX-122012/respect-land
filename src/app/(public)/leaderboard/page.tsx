import type { Metadata } from "next";
import { Leaderboard } from "@/components/leaderboard";

export const metadata: Metadata = {
  title: "المتصدرون",
  description: "أفضل صناع المحتوى في Respect Land بناءً على المشاهدات والتأثير.",
};

export default function LeaderboardPage() {
  return (
    <div className="container-page py-10 sm:py-14">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-brand-text">
          المتصدرون
        </h1>
        <p className="mt-2 text-sm text-brand-muted sm:text-base">
          أفضل صناع المحتوى في مجتمع Respect Land.
        </p>
      </div>
      <Leaderboard />
    </div>
  );
}