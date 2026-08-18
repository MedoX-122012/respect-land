"use client";

import { useEffect } from "react";
import { addRecentlyViewed, type RecentCreator } from "@/lib/recently-viewed";

export function RecentlyViewed({ creator }: { creator: RecentCreator }) {
  useEffect(() => {
    addRecentlyViewed(creator);
  }, [creator]);

  return null;
}