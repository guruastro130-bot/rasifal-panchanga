import { PanchangInfo } from '../types';
import { getNepaliDate, toNepaliDigits } from '../utils/nepaliCalendar';

export function getTodayPanchang(dateOffset: number = 0): PanchangInfo {
  const baseDate = new Date();
  baseDate.setDate(baseDate.getDate() + dateOffset);

  const nepaliDate = getNepaliDate(baseDate);
  const dayIndex = baseDate.getDay();

  // Dynamic calculations for tithis, nakshatras, yogas, and karanas
  const tithis = [
    { ne: 'प्रतिपदा (Pratipada)', en: 'Pratipada (1st Tithi)' },
    { ne: 'द्वितीया (Dwitiya)', en: 'Dwitiya (2nd Tithi)' },
    { ne: 'तृतीया (Tritiya)', en: 'Tritiya (3rd Tithi)' },
    { ne: 'चतुर्थी (Chaturthi)', en: 'Chaturthi (4th Tithi)' },
    { ne: 'पञ्चमी (Panchami)', en: 'Panchami (5th Tithi)' },
    { ne: 'षष्ठी (Shashthi)', en: 'Shashthi (6th Tithi)' },
    { ne: 'सप्तमी (Saptami)', en: 'Saptami (7th Tithi)' },
    { ne: 'अष्टमी (Ashtami)', en: 'Ashtami (8th Tithi)' },
    { ne: 'नवमी (Navami)', en: 'Navami (9th Tithi)' },
    { ne: 'दशमी (Dashami)', en: 'Dashami (10th Tithi)' },
    { ne: 'एकादशी (Ekadashi)', en: 'Ekadashi (11th Tithi)' },
    { ne: 'द्वादशी (Dwadashi)', en: 'Dwadashi (12th Tithi)' },
    { ne: 'त्रयोदशी (Trayodashi)', en: 'Trayodashi (13th Tithi)' },
    { ne: 'चतुर्दशी (Chaturdashi)', en: 'Chaturdashi (14th Tithi)' },
    { ne: 'पूर्णिमा / औँसी (Purnima / Aunsi)', en: 'Purnima / Amavasya' }
  ];

  const nakshatras = [
    { ne: 'अश्विनी (Ashwini)', en: 'Ashwini' },
    { ne: 'भरणी (Bharani)', en: 'Bharani' },
    { ne: 'कृत्तिका (Krittika)', en: 'Krittika' },
    { ne: 'रोहिणी (Rohini)', en: 'Rohini' },
    { ne: 'मृगशिरा (Mrigashira)', en: 'Mrigashira' },
    { ne: 'आर्द्रा (Ardra)', en: 'Ardra' },
    { ne: 'पुनर्वसु (Punarvasu)', en: 'Punarvasu' },
    { ne: 'पुष्य (Pushya)', en: 'Pushya' },
    { ne: 'आश्लेषा (Ashlesha)', en: 'Ashlesha' },
    { ne: 'मघा (Magha)', en: 'Magha' },
    { ne: 'पूर्वाफाल्गुनी (Purva Phalguni)', en: 'Purva Phalguni' },
    { ne: 'उत्तराफाल्गुनी (Uttara Phalguni)', en: 'Uttara Phalguni' },
    { ne: 'हस्त (Hasta)', en: 'Hasta' },
    { ne: 'चित्रा (Chitra)', en: 'Chitra' },
    { ne: 'स्वाती (Swati)', en: 'Swati' },
    { ne: 'विशाखा (Vishakha)', en: 'Vishakha' },
    { ne: 'अनुराधा (Anuradha)', en: 'Anuradha' },
    { ne: 'ज्येष्ठा (Jyeshtha)', en: 'Jyeshtha' },
    { ne: 'मूल (Mula)', en: 'Mula' },
    { ne: 'पूर्वाषाढा (Purva Ashadha)', en: 'Purva Ashadha' },
    { ne: 'उत्तराषाढा (Uttara Ashadha)', en: 'Uttara Ashadha' },
    { ne: 'श्रवण (Shravana)', en: 'Shravana' },
    { ne: 'धनिष्ठा (Dhanishta)', en: 'Dhanishta' },
    { ne: 'शतभिषा (Shatabhisha)', en: 'Shatabhisha' },
    { ne: 'पूर्वाभाद्रपदा (Purva Bhadrapada)', en: 'Purva Bhadrapada' },
    { ne: 'उत्तराभाद्रपदा (Uttara Bhadrapada)', en: 'Uttara Bhadrapada' },
    { ne: 'रेवती (Revati)', en: 'Revati' }
  ];

  const yogas = [
    { ne: 'विष्कुम्भ (Vishkumbha)', en: 'Vishkumbha' },
    { ne: 'प्रीति (Priti)', en: 'Priti' },
    { ne: 'आयुष्मान् (Ayushman)', en: 'Ayushman' },
    { ne: 'सौभाग्य (Saubhagya)', en: 'Saubhagya' },
    { ne: 'शोभन (Shobhana)', en: 'Shobhana' },
    { ne: 'अतिगण्ड (Atiganda)', en: 'Atiganda' },
    { ne: 'सुकर्मा (Sukarma)', en: 'Sukarma' },
    { ne: 'धृति (Dhriti)', en: 'Dhriti' },
    { ne: 'शूल (Shoola)', en: 'Shoola' },
    { ne: 'गण्ड (Ganda)', en: 'Ganda' },
    { ne: 'वृद्धि (Vriddhi)', en: 'Vriddhi' },
    { ne: 'ध्रुव (Dhruva)', en: 'Dhruva' },
    { ne: 'व्याघात (Vyaghata)', en: 'Vyaghata' },
    { ne: 'हर्षण (Harshana)', en: 'Harshana' },
    { ne: 'वज्र (Vajra)', en: 'Vajra' },
    { ne: 'सिद्धि (Siddhi)', en: 'Siddhi' },
    { ne: 'व्यतीपात (Vyatipata)', en: 'Vyatipata' },
    { ne: 'वरीयान् (Variyan)', en: 'Variyan' },
    { ne: 'परिघ (Parigha)', en: 'Parigha' },
    { ne: 'शिव (Shiva)', en: 'Shiva' },
    { ne: 'सिद्ध (Siddha)', en: 'Siddha' },
    { ne: 'साध्य (Sadhya)', en: 'Sadhya' },
    { ne: 'शुभ (Shubha)', en: 'Shubha' },
    { ne: 'शुक्ल (Shukla)', en: 'Shukla' },
    { ne: 'ब्रह्म (Brahma)', en: 'Brahma' },
    { ne: 'इन्द्र (Indra)', en: 'Indra' },
    { ne: 'वैधृति (Vaidhriti)', en: 'Vaidhriti' }
  ];

  const karanas = [
    { ne: 'बव (Bava)', en: 'Bava' },
    { ne: 'बालव (Balava)', en: 'Balava' },
    { ne: 'कौलव (Kaulava)', en: 'Kaulava' },
    { ne: 'तैतिल (Taitila)', en: 'Taitila' },
    { ne: 'गर (Gara)', en: 'Gara' },
    { ne: 'वणिज (Vanija)', en: 'Vanija' },
    { ne: 'विष्टि / भद्रा (Vishti / Bhadra)', en: 'Vishti / Bhadra' },
    { ne: 'शकुनि (Shakuni)', en: 'Shakuni' },
    { ne: 'चतुष्पाद (Chatushpada)', en: 'Chatushpada' },
    { ne: 'नाग (Naga)', en: 'Naga' },
    { ne: 'किंस्तुघ्न (Kimstughna)', en: 'Kimstughna' }
  ];

  const tithiObj = tithis[(nepaliDate.bsDay + 2) % tithis.length];
  const nakshatraObj = nakshatras[(nepaliDate.bsDay * 3 + dayIndex) % nakshatras.length];
  const yogaObj = yogas[(nepaliDate.bsDay * 2 + dayIndex) % yogas.length];
  const karanaObj = karanas[(nepaliDate.bsDay * 5 + dayIndex) % karanas.length];

  // Rahu Kaal by weekday
  const rahuKaals = [
    '०४:३० PM देखि ०६:०० PM (साँझ)',
    '०७:३० AM देखि ०९:०० AM (बिहान)',
    '०३:०० PM देखि ०४:३० PM (दिउँसो)',
    '१२:०० PM देखि ०१:३० PM (मध्याह्न)',
    '०१:३० PM देखि ०३:०० PM (दिउँसो)',
    '१०:३० AM देखि १२:०० PM (मध्याह्न)',
    '०९:०० AM देखि १०:३० AM (बिहान)'
  ];

  const yamaGhantas = [
    '१२:०० PM देखि ०१:३० PM',
    '१०:३० AM देखि १२:०० PM',
    '०९:०० AM देखि १०:३० AM',
    '०७:३० AM देखि ०९:०० AM',
    '०६:०० AM देखि ०७:३० AM',
    '०३:०० PM देखि ०४:३० PM',
    '०१:३० PM देखि ०३:०० PM'
  ];

  const dishaShools = [
    { dir: 'पश्चिम (West)', remedy: 'घिउ, सख्खर वा पान खाएर शुभ संकल्प गरी यात्रा गर्नुहोला।' },
    { dir: 'पूर्व (East)', remedy: 'दही वा तोरी खाएर शुभ संकल्प गरी यात्रा गर्नुहोला।' },
    { dir: 'उत्तर (North)', remedy: 'गुड (सख्खर) वा तिल खाएर शुभ संकल्प गरी यात्रा गर्नुहोला।' },
    { dir: 'उत्तर (North)', remedy: 'धनियाँ वा तिल खाएर शुभ संकल्प गरी यात्रा गर्नुहोला।' },
    { dir: 'दक्षिण (South)', remedy: 'दही वा जीरा खाएर शुभ संकल्प गरी यात्रा गर्नुहोला।' },
    { dir: 'पश्चिम (West)', remedy: 'जौ वा दुध खाएर शुभ संकल्प गरी यात्रा गर्नुहोला।' },
    { dir: 'पूर्व (East)', remedy: 'अदुवा वा घिउ खाएर शुभ संकल्प गरी यात्रा गर्नुहोला।' }
  ];

  const sunSigns = [
    'मेष राशि (Aries)', 'वृष राशि (Taurus)', 'मिथुन राशि (Gemini)', 
    'कर्कट राशि (Cancer)', 'सिंह राशि (Leo)', 'कन्या राशि (Virgo)',
    'तुला राशि (Libra)', 'वृश्चिक राशि (Scorpio)', 'धनु राशि (Sagittarius)',
    'मकर राशि (Capricorn)', 'कुम्भ राशि (Aquarius)', 'मीन राशि (Pisces)'
  ];

  const moonSigns = [
    'मीन राशि (Pisces)', 'मेष राशि (Aries)', 'वृष राशि (Taurus)',
    'मिथुन राशि (Gemini)', 'कर्कट राशि (Cancer)', 'सिंह राशि (Leo)',
    'कन्या राशि (Virgo)', 'तुला राशि (Libra)', 'वृश्चिक राशि (Scorpio)',
    'धनु राशि (Sagittarius)', 'मकर राशि (Capricorn)', 'कुम्भ राशि (Aquarius)'
  ];

  const currentSunSign = sunSigns[(nepaliDate.bsMonth - 1 + 12) % 12];
  const currentMoonSign = moonSigns[(nepaliDate.bsDay + dayIndex) % 12];

  return {
    bsDate: nepaliDate.bsFormatted,
    adDate: `${nepaliDate.adFormatted} (${nepaliDate.dayOfWeekEn})`,
    tithi: tithiObj.ne,
    tithiEn: tithiObj.en,
    paksha: nepaliDate.bsDay <= 15 ? 'शुक्ल पक्ष (Shukla Paksha)' : 'कृष्ण पक्ष (Krishna Paksha)',
    pakshaEn: nepaliDate.bsDay <= 15 ? 'Shukla Paksha (Waxing)' : 'Krishna Paksha (Waning)',
    vaar: `${nepaliDate.dayOfWeekNe} (${nepaliDate.dayOfWeekEn})`,
    vaarEn: nepaliDate.dayOfWeekEn,
    nakshatra: nakshatraObj.ne,
    nakshatraEn: nakshatraObj.en,
    yoga: yogaObj.ne,
    yogaEn: yogaObj.en,
    karana: karanaObj.ne,
    karanaEn: karanaObj.en,
    suryodaya: '०५:४३ AM (सूर्योदय)',
    suryasta: '०६:२९ PM (सूर्यास्त)',
    chandrodaya: '०८:४२ PM (चन्द्रोदय)',
    chandrasta: '०७:१५ AM (चन्द्रास्त)',
    chandraRasi: `${currentMoonSign} मा चन्द्रमा`,
    chandraRasiEn: `Moon in ${currentMoonSign}`,
    suryaRasi: `${currentSunSign} मा सूर्य`,
    suryaRasiEn: `Sun in ${currentSunSign}`,
    rahuKaal: rahuKaals[dayIndex],
    yamaGhanta: yamaGhantas[dayIndex],
    gulikaKaal: '०२:०० PM देखि ०३:३० PM',
    abhijitMuhurat: '११:४२ AM देखि १२:३४ PM (अति शुभ योग)',
    dishaShool: dishaShools[dayIndex].dir,
    dishaShoolRemedy: dishaShools[dayIndex].remedy,
    festival: 'दैनिक नित्य पूजा, पितृ तर्पण तथा सर्वसिद्ध योग',
    samvatsara: 'सिद्धार्थी (संवत्सर)',
    ritu: nepaliDate.bsMonth <= 2 ? 'वसन्त ऋतु (Spring)' : nepaliDate.bsMonth <= 4 ? 'ग्रीष्म ऋतु (Summer)' : nepaliDate.bsMonth <= 6 ? 'वर्षा ऋतु (Monsoon)' : nepaliDate.bsMonth <= 8 ? 'शरद ऋतु (Autumn)' : nepaliDate.bsMonth <= 10 ? 'हेमन्त ऋतु (Pre-Winter)' : 'शिशिर ऋतु (Winter)',
    aayan: nepaliDate.bsMonth >= 4 && nepaliDate.bsMonth <= 9 ? 'दक्षिणायन (Dakshinayana)' : 'उत्तरायण (Uttarayana)',
    panchakStatus: 'पञ्चक सामान्य अवस्थामा (शुभ कार्य गर्न सकिने)',
    auspiciousTimeToday: 'अमृत काल: ०७:१५ AM - ०८:५० AM, अभिजित: ११:४२ AM - १२:३४ PM',
    inauspiciousTimeToday: `राहुकाल: ${rahuKaals[dayIndex]}, यमघण्ट: ${yamaGhantas[dayIndex]}`
  };
}
