export type RasiId =
  | 'mesh'
  | 'vrish'
  | 'mithun'
  | 'karkat'
  | 'simha'
  | 'kanya'
  | 'tula'
  | 'vrischika'
  | 'dhanu'
  | 'makar'
  | 'kumbha'
  | 'meen';

export type HoroscopePeriod = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface HoroscopeSection {
  summary: string;
  career: string;
  wealth: string;
  love: string;
  health: string;
  travelOrFamily?: string;
  remedies: string;
  mantra: string;
  luckyColor: string;
  luckyNumber: string;
  luckyDirection: string;
  rating: number; // 1 to 5
  highlights: string[];
}

export interface RasiInfo {
  id: RasiId;
  order: number;
  nepaliName: string;
  englishName: string;
  sanskritName: string;
  symbol: string;
  symbolEmoji: string;
  element: string; // अग्नि, पृथ्वी, वायु, जल
  elementEn: string; // Fire, Earth, Air, Water
  lord: string; // मङ्गल, शुक्र, बुध, चन्द्र, सूर्य, शनि, बृहस्पति
  lordEn: string; // Mars, Venus, Mercury, Moon, Sun, Saturn, Jupiter
  nepaliNamakshyar: string;
  englishNamakshyar: string;
  namakshyarListNepali: string[];
  namakshyarListEnglish: string[];
  defaultLuckyColor: string;
  defaultLuckyNumber: string;
  defaultLuckyDirection: string;
  vedicMantra: string;
  friendlyRasi: string;
  unfriendlyRasi: string;
  daily: HoroscopeSection;
  weekly: HoroscopeSection;
  monthly: HoroscopeSection;
  yearly: HoroscopeSection;
}

export interface PanchangInfo {
  bsDate: string;
  adDate: string;
  tithi: string;
  tithiEn: string;
  paksha: string;
  pakshaEn: string;
  vaar: string;
  vaarEn: string;
  nakshatra: string;
  nakshatraEn: string;
  yoga: string;
  yogaEn: string;
  karana: string;
  karanaEn: string;
  suryodaya: string;
  suryasta: string;
  chandrodaya: string;
  chandrasta: string;
  chandraRasi: string;
  chandraRasiEn: string;
  suryaRasi: string;
  suryaRasiEn: string;
  rahuKaal: string;
  yamaGhanta: string;
  gulikaKaal: string;
  abhijitMuhurat: string;
  dishaShool: string;
  dishaShoolRemedy: string;
  festival: string;
  samvatsara: string;
  ritu: string;
  aayan: string;
  panchakStatus: string;
  auspiciousTimeToday: string;
  inauspiciousTimeToday: string;
}

export interface LivePredictionRequest {
  rasiId: RasiId;
  period: HoroscopePeriod;
  customQuestion?: string;
  birthDate?: string;
  birthTime?: string;
  birthPlace?: string;
  language?: 'ne' | 'en';
}

export interface LivePredictionResponse {
  rasiId: RasiId;
  period: HoroscopePeriod;
  generatedDate: string;
  prediction: HoroscopeSection;
  planetaryPositionsSummary?: string;
  astrologerNotes?: string;
}

export type SocialPlatform = 'facebook' | 'instagram' | 'tiktok' | 'youtube';

export interface SocialPostDraft {
  platform: SocialPlatform;
  platformNameNe: string;
  title: string;
  content: string;
  hashtags: string[];
  shortScript?: string;
  suggestedMusic?: string;
  cardHeadline?: string;
}

export interface SocialAutoPostSettings {
  enabled: boolean;
  morningTime: string; // e.g. "06:00"
  webhookUrl: string; // Zapier / Make / Pipedream / Custom endpoint
  metaAccessToken?: string; // Optional Facebook / IG Graph API Token
  autoGenerateImage: boolean;
  enabledPlatforms: {
    facebook: boolean;
    instagram: boolean;
    tiktok: boolean;
    youtube: boolean;
  };
  lastBroadcastTime?: string;
  lastBroadcastStatus?: string;
}

export interface SocialBroadcastLog {
  id: string;
  timestamp: string;
  dateText: string;
  platforms: SocialPlatform[];
  status: 'success' | 'warning' | 'error';
  message: string;
  previewSnippet: string;
}
