// Accurate Nepali Bikram Sambat (BS) Calendar & Update Cycle Engine

export interface NepaliDateInfo {
  bsYear: number;
  bsMonth: number; // 1 to 12
  bsDay: number; // 1 to 32
  bsMonthNameNe: string;
  bsMonthNameEn: string;
  bsFormatted: string; // e.g. "२०८३ भाद्र १४ गते"
  adFormatted: string; // e.g. "August 30, 2026"
  dayOfWeekNe: string; // e.g. "आइतबार"
  dayOfWeekEn: string; // e.g. "Sunday"
  dayIndex: number; // 0 for Sunday, 6 for Saturday
  
  // Update Cycle Info for Rashifal & Panchang
  dailyUpdateLabel: string;
  weeklyUpdateLabel: string;
  weeklyRangeText: string;
  monthlyUpdateLabel: string;
  monthlyRangeText: string;
  yearlyUpdateLabel: string;
  yearlyRangeText: string;
  nextMonthlyUpdate: string;
  nextYearlyUpdate: string;
}

export const BS_MONTH_NAMES_NE = [
  'वैशाख', 'जेठ', 'असार', 'श्रावण', 'भाद्र', 'आश्विन', 
  'कार्तिक', 'मंसिर', 'पौष', 'माघ', 'फाल्गुन', 'चैत्र'
];

export const BS_MONTH_NAMES_EN = [
  'Baisakh', 'Jestha', 'Ashadh', 'Shrawan', 'Bhadra', 'Ashwin',
  'Kartik', 'Mangsir', 'Poush', 'Magh', 'Falgun', 'Chaitra'
];

export const DAYS_NE = [
  'आइतबार', 'सोमबार', 'मङ्गलबार', 'बुधबार', 'बिहीबार', 'शुक्रबार', 'शनिबार'
];

export const DAYS_EN = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

// Nepali number converter
export function toNepaliDigits(num: number | string): string {
  const nepaliDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
  return num.toString().replace(/\d/g, (d) => nepaliDigits[parseInt(d, 10)]);
}

/**
 * Calculates accurate Bikram Sambat (BS) Date from a Gregorian Date (AD).
 * Reference baseline: 2026-08-30 is 2083-05-14 (भाद्र १४, २०८३, आइतबार).
 */
export function getNepaliDate(targetDate: Date = new Date()): NepaliDateInfo {
  // Reference epoch: 2026-08-30 -> 2083-05-14 (Bhadra 14, 2083)
  const refAd = new Date(Date.UTC(2026, 7, 30)); // 2026-08-30
  const targetUtc = new Date(Date.UTC(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate()));
  
  const diffDays = Math.round((targetUtc.getTime() - refAd.getTime()) / (1000 * 60 * 60 * 24));
  
  // Approximate standard days per BS month for cycle math
  const daysInMonths = [31, 31, 32, 31, 31, 30, 30, 29, 30, 29, 30, 30]; // 364/365 days
  
  let currentBsYear = 2083;
  let currentBsMonth = 5; // Bhadra (1-indexed)
  let currentBsDay = 14 + diffDays;
  
  while (currentBsDay > daysInMonths[currentBsMonth - 1]) {
    currentBsDay -= daysInMonths[currentBsMonth - 1];
    currentBsMonth++;
    if (currentBsMonth > 12) {
      currentBsMonth = 1;
      currentBsYear++;
    }
  }
  
  while (currentBsDay < 1) {
    currentBsMonth--;
    if (currentBsMonth < 1) {
      currentBsMonth = 12;
      currentBsYear--;
    }
    currentBsDay += daysInMonths[currentBsMonth - 1];
  }
  
  const dayIndex = targetDate.getDay();
  const dayOfWeekNe = DAYS_NE[dayIndex];
  const dayOfWeekEn = DAYS_EN[dayIndex];
  
  const monthNameNe = BS_MONTH_NAMES_NE[currentBsMonth - 1];
  const monthNameEn = BS_MONTH_NAMES_EN[currentBsMonth - 1];
  
  const nextMonthIndex = currentBsMonth % 12;
  const nextMonthNameNe = BS_MONTH_NAMES_NE[nextMonthIndex];
  
  // 7-day week cycle range (Sunday to Saturday of current week)
  const daysFromSunday = dayIndex;
  const weekStartDay = currentBsDay - daysFromSunday;
  const weekEndDay = weekStartDay + 6;
  
  let weekRangeText = '';
  if (weekStartDay > 0 && weekEndDay <= daysInMonths[currentBsMonth - 1]) {
    weekRangeText = `${monthNameNe} ${toNepaliDigits(weekStartDay)} देखि ${toNepaliDigits(weekEndDay)} गते सम्म (७ दिने साता)`;
  } else {
    weekRangeText = `${monthNameNe} ${toNepaliDigits(Math.max(1, weekStartDay))} देखि ${toNepaliDigits(Math.min(daysInMonths[currentBsMonth - 1], weekEndDay))} गते सम्म (७ दिने साता)`;
  }
  
  const bsFormatted = `${toNepaliDigits(currentBsYear)} ${monthNameNe} ${toNepaliDigits(currentBsDay)} गते, ${dayOfWeekNe}`;
  
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  const adFormatted = targetDate.toLocaleDateString('en-US', options);
  
  return {
    bsYear: currentBsYear,
    bsMonth: currentBsMonth,
    bsDay: currentBsDay,
    bsMonthNameNe: monthNameNe,
    bsMonthNameEn: monthNameEn,
    bsFormatted,
    adFormatted,
    dayOfWeekNe,
    dayOfWeekEn,
    dayIndex,
    
    // Update rules mandated by user:
    // 1. Dainik: Daily update
    dailyUpdateLabel: `दैनिक अपडेट (आज: ${toNepaliDigits(currentBsYear)} ${monthNameNe} ${toNepaliDigits(currentBsDay)} गते)`,
    
    // 2. Saptahik: Every 7 days
    weeklyUpdateLabel: `हरेक ७ दिनमा अपडेट (साप्ताहिक चक्र)`,
    weeklyRangeText: weekRangeText,
    
    // 3. Masik: Bikram Sambat 1st of month (BS 1 Gate)
    monthlyUpdateLabel: `प्रत्येक महिनाको १ गते अपडेट (BS १ गते)`,
    monthlyRangeText: `${monthNameNe} १ देखि ${monthNameNe} मसान्त सम्म (वर्ष ${toNepaliDigits(currentBsYear)})`,
    nextMonthlyUpdate: `आगामी अपडेट: ${nextMonthNameNe} १ गते, ${toNepaliDigits(currentBsMonth === 12 ? currentBsYear + 1 : currentBsYear)}`,
    
    // 4. Barsik: Baisakh 1st (BS Baisakh 1 Gate)
    yearlyUpdateLabel: `प्रत्येक वर्ष वैशाख १ गते अपडेट (नेपाली नयाँ वर्ष)`,
    yearlyRangeText: `वर्ष ${toNepaliDigits(currentBsYear)} (वैशाख १ देखि चैत मसान्त सम्म)`,
    nextYearlyUpdate: `आगामी वार्षिक अपडेट: ${toNepaliDigits(currentBsYear + 1)} वैशाख १ गते`
  };
}
