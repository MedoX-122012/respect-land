export interface VideoInfo {
  externalId: string;
  title?: string;
  thumbnail?: string;
  url: string;
  views?: number;
  likes?: number;
  comments?: number;
  publishedAt?: string;
  platform: string;
}

export interface ScrapeResult {
  platform: string;
  handle?: string;
  channelId?: string;
  avatar?: string;
  bio?: string;
  followerCount?: number;
  views?: number;
  totalLikes?: number;
  videoCount?: number;
  verified?: boolean;
  latestVideo?: VideoInfo;
  topViewed?: VideoInfo;
  topLiked?: VideoInfo;
  videos?: VideoInfo[];
  error?: string;
}
