import { Hero } from "@/components/hero";
import { FeaturedCreators } from "@/components/sections/featured-creators";
import { FeaturedCategories } from "@/components/sections/featured-categories";
import { TrendingSection } from "@/components/sections/trending";
import { CreatorOfTheWeek } from "@/components/sections/creator-of-week";
import { NewCreators } from "@/components/sections/new-creators";
import { LeaderboardPreview } from "@/components/sections/leaderboard-preview";
import { CommunityCTA } from "@/components/sections/community-cta";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedCreators />
      <FeaturedCategories />
      <TrendingSection />
      <CreatorOfTheWeek />
      <NewCreators />
      <LeaderboardPreview />
      <CommunityCTA />
    </>
  );
}