export interface Competitor {
  id: string;
  name: string;
  domain: string;
  platforms: Platform[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Ad {
  id: string;
  competitorId: string;
  competitorName?: string;
  platform: Platform;
  creativeUrl?: string;
  text: string;
  dateFound: Date;
  format: AdFormat;
  isActive: boolean;
  metadata?: Record<string, any>;
}

export interface SearchResult {
  id: string;
  keyword: string;
  state: USState;
  date: Date;
  rankings: CompetitorRanking[];
  serpScreenshot?: string;
}

export interface CompetitorRanking {
  id: string;
  competitorId: string;
  searchResultId: string;
  position: number;
  adCopy?: string;
  url: string;
}

export interface Bookmark {
  id: string;
  userId: string;
  adId: string;
  notes?: string;
  createdAt: Date;
}

export enum Platform {
  META = 'meta',
  SNAPCHAT = 'snapchat',
  TWITTER = 'twitter',
  GOOGLE_SEARCH = 'google_search',
  GOOGLE_DISPLAY = 'google_display'
}

export enum AdFormat {
  IMAGE = 'image',
  VIDEO = 'video',
  CAROUSEL = 'carousel',
  TEXT = 'text'
}

export enum USState {
  CA = 'CA',
  TX = 'TX',
  FL = 'FL',
  NY = 'NY',
  IL = 'IL'
}

export interface DashboardStats {
  totalAds: number;
  activeCompetitors: number;
  newAdsToday: number;
  searchPositionChanges: number;
}

export interface AdFilter {
  platform?: Platform;
  competitor?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  format?: AdFormat;
  isActive?: boolean;
}