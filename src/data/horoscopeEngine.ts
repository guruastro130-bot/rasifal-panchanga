import { RasiInfo, HoroscopePeriod, HoroscopeSection } from '../types';
import { allRasis } from './horoscopeData';
import { getNepaliDate, NepaliDateInfo, toNepaliDigits } from '../utils/nepaliCalendar';

/**
 * Planetary influences based on weekdays, tithis and BS month transitions
 */
const dailyVariations: Record<number, {
  moodNe: string;
  focusNe: string;
  remedyPrefix: string;
  ratingAdj: number;
}> = {
  0: { // Sunday (Sun)
    moodNe: 'आत्मबल र ऊर्जा उच्च रहनेछ। सरकारी वा प्रशासनिक कार्यमा सहजता मिल्नेछ।',
    focusNe: 'नेतृत्व विकास, मान-सम्मान र प्रतिष्ठामा ध्यान दिनुहोला।',
    remedyPrefix: 'सूर्यदेवलाई तामाको लोटाबाट जल अर्पण गर्नुहोस्।',
    ratingAdj: 0
  },
  1: { // Monday (Moon)
    moodNe: 'मानसिक शान्ति र भावनात्मक सन्तुष्टि मिल्नेछ। आमा वा मातृपक्षबाट सहयोग प्राप्त हुनेछ।',
    focusNe: 'रचनात्मक कार्य, पारिवारिक संवाद र सौहार्दतामा जोड दिनुहोला।',
    remedyPrefix: 'शिवलिंगमा शुद्ध जल वा काँचो दुध अर्पण गर्नुहोस्।',
    ratingAdj: 0
  },
  2: { // Tuesday (Mars)
    moodNe: 'साहस, पराक्रम र निर्णय क्षमतामा वृद्धि हुनेछ। रोकिएका कामहरू गति लिनेछन्।',
    focusNe: 'आवेश र रिसलाई नियन्त्रण गरी योजनाबद्ध रूपमा अगाडि बढ्नुहोस्।',
    remedyPrefix: 'हनुमान चालिसाको पाठ गर्नुहोस् र रातो वस्तुको प्रयोग गर्नुहोस्।',
    ratingAdj: 0
  },
  3: { // Wednesday (Mercury)
    moodNe: 'बौद्धिक क्षमता र वाकचातुर्यको भरपूर सदुपयोग हुनेछ। व्यापार तथा सञ्चारमा फाइदा हुनेछ।',
    focusNe: 'बैठक, वार्ता र नयाँ सम्झौताहरू सफल बनाउन प्रयत्नशील रहनुहोस्।',
    remedyPrefix: 'भगवान गणेशलाई दुबो चढाउनुहोस् र ॐ गं गणपतये नमः जप गर्नुहोस्।',
    ratingAdj: 1
  },
  4: { // Thursday (Jupiter)
    moodNe: 'भाग्यको साथ मिल्नेछ। अध्ययन, अनुसन्धान र धार्मिक कार्यमा विशेष रुचि रहनेछ।',
    focusNe: 'गुरुजन तथा मान्यजनहरूको आशीर्वाद लिई महत्वपूर्ण निर्णय लिनुहोला।',
    remedyPrefix: 'भगवान विष्णुको आराधना गर्नुहोस् र पहेँलो वस्तुको प्रयोग गर्नुहोस्।',
    ratingAdj: 1
  },
  5: { // Friday (Venus)
    moodNe: 'सुख, सुविधा र मनोरञ्जनमा दिन बित्नेछ। कला, फेसन तथा सौन्दर्यमा रुचि बढ्नेछ।',
    focusNe: 'आर्थिक लगानी र प्रेम सम्बन्धलाई सन्तुलित बनाउनुहोला।',
    remedyPrefix: 'माता महालक्ष्मीको स्तुति गर्नुहोस् र सेतो मिठाई अर्पण गर्नुहोस्।',
    ratingAdj: 0
  },
  6: { // Saturday (Saturn)
    moodNe: 'धैर्य र परिश्रमको उचित फल प्राप्त हुनेछ। स्थिर सम्पत्ति तथा प्राविधिक कार्यमा लाभ हुनेछ।',
    focusNe: 'अनुशासन र लगनशीलताका साथ कर्तव्य पालनामा केन्द्रित रहनुहोला।',
    remedyPrefix: 'शनिदेव वा पीपलको रुखमा जल चढाउनुहोस् र गरिबलाई सहयोग गर्नुहोस्।',
    ratingAdj: 0
  }
};

/**
 * Returns dynamic, authentic horoscope for all 12 signs based on current date / period
 * 1. Daily: updates every day based on targetDate day index & BS day
 * 2. Weekly: updates every 7 days (Sunday to Saturday cycle)
 * 3. Monthly: updates on BS 1st of every month (Bhadra 1, Ashwin 1, etc.)
 * 4. Yearly: updates on Baisakh 1st of BS year
 */
export function getDynamicRasis(targetDate: Date = new Date()): { rasis: RasiInfo[]; nepaliDate: NepaliDateInfo } {
  const nepaliDate = getNepaliDate(targetDate);
  const dayIndex = targetDate.getDay();
  const dayVariation = dailyVariations[dayIndex] || dailyVariations[0];

  const updatedRasis = allRasis.map((baseRasi, idx) => {
    // Generate slight day-to-day astrological dynamism for daily
    const dailyBase = baseRasi.daily;
    const weeklyBase = baseRasi.weekly;
    const monthlyBase = baseRasi.monthly;
    const yearlyBase = baseRasi.yearly;

    // Daily calculation
    const calculatedRating = Math.min(5, Math.max(3, (dailyBase.rating + dayVariation.ratingAdj + (idx % 2 === 0 ? 0 : 0))));
    
    const dynamicDaily: HoroscopeSection = {
      ...dailyBase,
      summary: `${nepaliDate.dayOfWeekNe}को दिन ${baseRasi.nepaliName}का लागि: ${dayVariation.moodNe} ${dailyBase.summary}`,
      career: `${dailyBase.career} ${dayVariation.focusNe}`,
      remedies: `${dayVariation.remedyPrefix} ${dailyBase.remedies}`,
      rating: calculatedRating,
      highlights: [
        `${nepaliDate.dayOfWeekNe}को शुभ प्रभाव`,
        ...(dailyBase.highlights || ['कार्य सिद्धि', 'सकारात्मक ऊर्जा'])
      ]
    };

    // Weekly calculation (Every 7 days cycle)
    const dynamicWeekly: HoroscopeSection = {
      ...weeklyBase,
      summary: `यस ७ दिने साता (${nepaliDate.weeklyRangeText}): ${weeklyBase.summary}`,
      highlights: [
        `७ दिने साताको फल`,
        ...(weeklyBase.highlights || ['उन्नति र प्रगति', 'पारिवारिक सुख'])
      ]
    };

    // Monthly calculation (BS 1st to Month End)
    const dynamicMonthly: HoroscopeSection = {
      ...monthlyBase,
      summary: `${nepaliDate.bsMonthNameNe} महिनाको मासिक राशिफल (${nepaliDate.monthlyRangeText}): ${monthlyBase.summary}`,
      highlights: [
        `${nepaliDate.bsMonthNameNe} महिनाभरको फल`,
        ...(monthlyBase.highlights || ['दीर्घकालीन सफलता', 'आर्थिक स्थायित्व'])
      ]
    };

    // Yearly calculation (Baisakh 1st to Chaitra End)
    const dynamicYearly: HoroscopeSection = {
      ...yearlyBase,
      summary: `वर्ष ${toNepaliDigits(nepaliDate.bsYear)} को सम्पूर्ण वार्षिक राशिफल (${nepaliDate.yearlyRangeText}): ${yearlyBase.summary}`,
      highlights: [
        `वर्ष ${toNepaliDigits(nepaliDate.bsYear)} को वार्षिक फल`,
        ...(yearlyBase.highlights || ['वार्षिक कीर्ति', 'भाग्य वृद्धि'])
      ]
    };

    return {
      ...baseRasi,
      daily: dynamicDaily,
      weekly: dynamicWeekly,
      monthly: dynamicMonthly,
      yearly: dynamicYearly
    };
  });

  return {
    rasis: updatedRasis,
    nepaliDate
  };
}
