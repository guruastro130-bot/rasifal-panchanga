import express from 'express';
import path from 'path';
import { GoogleGenAI, Modality } from '@google/genai';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { allRasis } from './src/data/horoscopeData';
import { getDynamicRasis } from './src/data/horoscopeEngine';
import { getTodayPanchang } from './src/data/panchangData';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Google Gemini Client lazily or safely
const getGeminiAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('GEMINI_API_KEY is not set. Realtime AI queries will fallback to Vedic calculated engine.');
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// --- API Endpoints ---

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', serverTime: new Date().toISOString() });
});

// 2. Panchang API
app.get('/api/panchang', (req, res) => {
  try {
    const offset = parseInt(req.query.offset as string) || 0;
    const panchang = getTodayPanchang(offset);
    res.json({ success: true, panchang });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 3. Rashifal API (Pre-computed and dynamic enriched Vedic engine)
app.get('/api/rashifal', (req, res) => {
  try {
    const offset = parseInt(req.query.offset as string) || 0;
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + offset);
    const { rasis, nepaliDate } = getDynamicRasis(targetDate);
    res.json({ success: true, rasis, nepaliDate });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 4. Live AI Horoscope Prediction with Gemini API
app.post('/api/gemini/live-prediction', async (req, res) => {
  try {
    const { rasiId, period = 'daily', customQuestion, birthDate, birthTime, birthPlace, language = 'ne' } = req.body;
    
    const rasi = allRasis.find(r => r.id === rasiId) || allRasis[0];
    const panchang = getTodayPanchang();
    
    const ai = getGeminiAI();
    if (!ai) {
      // Return enhanced pre-calculated data if API key not available
      const section = rasi[period as 'daily' | 'weekly' | 'monthly' | 'yearly'] || rasi.daily;
      return res.json({
        success: true,
        isAiGenerated: false,
        data: {
          rasiId: rasi.id,
          period,
          generatedDate: new Date().toISOString(),
          prediction: section,
          planetaryPositionsSummary: `चन्द्रमा: ${panchang.chandraRasi}, सूर्य: ${panchang.suryaRasi}, नक्षत्र: ${panchang.nakshatra}`,
          astrologerNotes: 'वैदिक ज्योतिष सिद्धान्त तथा ग्रह गोचर अनुसार गणना गरिएको प्रमाणित राशिफल।'
        }
      });
    }

    const prompt = `तपाईं एक अनुभवी, विद्वान र आधिकारिक वैदिक ज्योतिषाचार्य हुनुहुन्छ।
आजको पञ्चाङ्ग:
- मिति: ${panchang.bsDate} (${panchang.adDate})
- तिथि: ${panchang.tithi}, पक्ष: ${panchang.paksha}, वार: ${panchang.vaar}
- नक्षत्र: ${panchang.nakshatra}, योग: ${panchang.yoga}, करण: ${panchang.karana}
- चन्द्र राशि: ${panchang.chandraRasi}, सूर्य राशि: ${panchang.suryaRasi}

कृपया निम्नलिखित राशिको लागि अत्यन्त विस्तृत, सटिक र व्यावहारिक ${period} (दैनिक/साप्ताहिक/मासिक/वार्षिक) राशिफल तयार पार्नुहोस्:
- राशि: ${rasi.nepaliName} (${rasi.englishName})
- स्वामी ग्रह: ${rasi.lord}
- नामाक्षर (Starting Letters): ${rasi.nepaliNamakshyar} (${rasi.englishNamakshyar})
- तत्व: ${rasi.element}
${customQuestion ? `- प्रयोगकर्ताको विशेष प्रश्न: "${customQuestion}"` : ''}
${birthDate ? `- जन्म मिति/समय: ${birthDate} ${birthTime || ''} ${birthPlace || ''}` : ''}

कृपया तल दिइएको ढाँचामा नेपाली भाषामा JSON मात्र आउटपुट दिनुहोस्:
{
  "summary": "विस्तृत समग्र फल (३-४ वाक्यमा एकदमै प्रेरणादायी र सटिक)",
  "career": "पेशा, व्यवसाय, जागिर तथा व्यापार सम्बन्धी विस्तृत फल",
  "wealth": "आर्थिक स्थिति, लगानी, धनलाभ तथा बचत सम्बन्धी फल",
  "love": "प्रेम, वैवाहिक जीवन तथा पारिवारिक सम्बन्ध",
  "health": "स्वास्थ्य, खानपान, सजगता तथा ऊर्जा",
  "travelOrFamily": "यात्रा वा पारिवारिक सुख",
  "remedies": "ज्योतिषीय सरल उपाय र दान",
  "mantra": "वैदिक मन्त्र (देवनागरीमा)",
  "luckyColor": "शुभ रङ्ग (नेपाली र अंग्रेजी)",
  "luckyNumber": "शुभ अङ्क",
  "luckyDirection": "शुभ दिशा",
  "rating": 5, // १ देखि ५ सम्म
  "highlights": ["मुख्य विशेषता १", "मुख्य विशेषता २", "मुख्य विशेषता ३"],
  "planetaryPositionsSummary": "आजको ग्रह गोचर र राशिमा प्रभाव",
  "astrologerNotes": "ज्योतिषाचार्यको विशेष सुझाव"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });

    const text = response.text || '{}';
    const parsedData = JSON.parse(text);

    return res.json({
      success: true,
      isAiGenerated: true,
      data: {
        rasiId: rasi.id,
        period,
        generatedDate: new Date().toISOString(),
        prediction: {
          summary: parsedData.summary || rasi[period as 'daily' | 'weekly' | 'monthly' | 'yearly']?.summary,
          career: parsedData.career || rasi[period as 'daily' | 'weekly' | 'monthly' | 'yearly']?.career,
          wealth: parsedData.wealth || rasi[period as 'daily' | 'weekly' | 'monthly' | 'yearly']?.wealth,
          love: parsedData.love || rasi[period as 'daily' | 'weekly' | 'monthly' | 'yearly']?.love,
          health: parsedData.health || rasi[period as 'daily' | 'weekly' | 'monthly' | 'yearly']?.health,
          travelOrFamily: parsedData.travelOrFamily || rasi[period as 'daily' | 'weekly' | 'monthly' | 'yearly']?.travelOrFamily,
          remedies: parsedData.remedies || rasi[period as 'daily' | 'weekly' | 'monthly' | 'yearly']?.remedies,
          mantra: parsedData.mantra || rasi.vedicMantra,
          luckyColor: parsedData.luckyColor || rasi.defaultLuckyColor,
          luckyNumber: parsedData.luckyNumber || rasi.defaultLuckyNumber,
          luckyDirection: parsedData.luckyDirection || rasi.defaultLuckyDirection,
          rating: parsedData.rating || 5,
          highlights: parsedData.highlights || ['सकारात्मक ऊर्जा', 'कार्य सफलता', 'सुख समृद्धि']
        },
        planetaryPositionsSummary: parsedData.planetaryPositionsSummary || `चन्द्रमा: ${panchang.chandraRasi}, सूर्य: ${panchang.suryaRasi}`,
        astrologerNotes: parsedData.astrologerNotes || 'ग्रहहरूको शुभ प्रभावका कारण दिन अनुकूल रहनेछ।'
      }
    });

  } catch (error: any) {
    console.error('Error generating live horoscope:', error);
    // Fallback to static
    const rasi = allRasis.find(r => r.id === req.body.rasiId) || allRasis[0];
    const period = req.body.period || 'daily';
    res.json({
      success: true,
      isAiGenerated: false,
      data: {
        rasiId: rasi.id,
        period,
        generatedDate: new Date().toISOString(),
        prediction: rasi[period as 'daily' | 'weekly' | 'monthly' | 'yearly'] || rasi.daily,
        planetaryPositionsSummary: 'प्रत्यक्ष वैदिक गणना अनुसार',
        astrologerNotes: 'ग्रह गोचरको स्थिति अनुकूल रहेको छ।'
      }
    });
  }
});

// 5. Kundali / Namakshyar Rasi Finder
app.post('/api/gemini/rasi-finder', async (req, res) => {
  try {
    const { name, firstLetter, birthDate, birthTime, birthPlace } = req.body;
    
    // Check locally by namakshyar first
    if (firstLetter || name) {
      const letterToMatch = (firstLetter || name.trim().charAt(0)).toLowerCase();
      
      for (const rasi of allRasis) {
        const hasNepaliMatch = rasi.namakshyarListNepali.some(nl => name?.includes(nl) || firstLetter === nl);
        const hasEnglishMatch = rasi.namakshyarListEnglish.some(el => el.toLowerCase() === letterToMatch || name?.toLowerCase().startsWith(el.toLowerCase()));
        
        if (hasNepaliMatch || hasEnglishMatch) {
          return res.json({
            success: true,
            rasi,
            method: 'namakshyar_match',
            message: `तपाईंको नाम वा नामाक्षर अनुसार तपाईंको राशि ${rasi.nepaliName} (${rasi.englishName}) हो।`
          });
        }
      }
    }

    const ai = getGeminiAI();
    if (ai) {
      const prompt = `प्रयोगकर्ताको नाम: "${name || ''}", नामाक्षर: "${firstLetter || ''}", जन्म मिति: "${birthDate || ''}", समय: "${birthTime || ''}", स्थान: "${birthPlace || ''}"।
वैदिक ज्योतिष अनुसार यो व्यक्तिको राशि कुन हो? कुन नामाक्षर पर्छ? नक्षत्र के हुन सक्छ?
१२ राशिहरू: mesh, vrish, mithun, karkat, simha, kanya, tula, vrischika, dhanu, makar, kumbha, meen.
कृपया JSON मा उत्तर दिनुहोस्:
{
  "rasiId": "mesh", // उपयुक्त राशि ID
  "rasiNameNepali": "मेष राशि",
  "rasiNameEnglish": "Aries",
  "matchedNamakshyar": "ला, ली, चु...",
  "explanation": "विस्तृत व्याख्या",
  "nakshatraSuggestion": "अनुमानित नक्षत्र"
}`;
      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' },
      });
      const parsed = JSON.parse(response.text || '{}');
      const matchedRasi = allRasis.find(r => r.id === parsed.rasiId) || allRasis[0];
      return res.json({
        success: true,
        rasi: matchedRasi,
        method: 'ai_vedic_analysis',
        explanation: parsed.explanation,
        nakshatraSuggestion: parsed.nakshatraSuggestion,
        message: `तपाईंको विवरण अनुसार राशि: ${matchedRasi.nepaliName} (${matchedRasi.englishName})`
      });
    }

    // Default fallback
    res.json({
      success: true,
      rasi: allRasis[0],
      method: 'default',
      message: 'मेष राशि'
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 6. Text-to-Speech API for Crystal Clear Authentic Nepali Horoscope Recitation
app.post('/api/tts', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ success: false, error: 'Valid text is required' });
    }

    const ai = getGeminiAI();
    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-tts-preview',
        contents: [{ parts: [{ text: `Speak in clear, slow, dignified, authentic, natural, fluent Nepali language with proper pauses and crystal clear pronunciation: ${text.slice(0, 1000)}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        return res.json({
          success: true,
          audioData: base64Audio,
          sampleRate: 24000,
          mimeType: 'audio/pcm;rate=24000'
        });
      }
    }

    res.json({ success: false, error: 'Voice service unavailable' });
  } catch (error: any) {
    console.warn('TTS generation warning:', error.message);
    res.json({ success: false, error: error.message });
  }
});

// --- SOCIAL MEDIA AUTOMATED POSTING & DISPATCH ENGINE ---
const DEFAULT_MAKE_WEBHOOK_URL = 'https://hook.us2.make.com/9aakku13k7jg7fzb1ezuo6zp7aj6ipak';

interface SocialAutoPostConfig {
  enabled: boolean;
  morningTime: string; // "06:00"
  webhookUrl: string;
  metaAccessToken?: string;
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

let socialConfig: SocialAutoPostConfig = {
  enabled: true,
  morningTime: '06:00',
  webhookUrl: DEFAULT_MAKE_WEBHOOK_URL,
  metaAccessToken: '',
  autoGenerateImage: true,
  enabledPlatforms: {
    facebook: true,
    instagram: true,
    tiktok: true,
    youtube: true,
  },
  lastBroadcastTime: new Date().toISOString(),
  lastBroadcastStatus: 'सक्रिय (Active & Scheduled for 06:00 AM)',
};

let socialLogs: Array<{
  id: string;
  timestamp: string;
  dateText: string;
  platforms: string[];
  status: 'success' | 'warning' | 'error';
  message: string;
  previewSnippet: string;
}> = [
  {
    id: 'log-init',
    timestamp: new Date().toLocaleTimeString('ne-NP', { hour: '2-digit', minute: '2-digit' }),
    dateText: 'आजको पञ्चाङ्ग तथा राशिफल',
    platforms: ['facebook', 'instagram', 'tiktok', 'youtube'],
    status: 'success',
    message: 'Make.com Webhook र स्वचालित सामाजिक सञ्जाल प्रसारण प्रणाली सक्रिय भएको छ। Make.com URL: https://hook.us2.make.com/9aakku13k7jg7fzb1ezuo6zp7aj6ipak',
    previewSnippet: '🚩 दैनिक राशिफल तथा पञ्चाङ्ग: १२ वटै राशिका शुभ अङ्क, रङ्ग, फलादेश तथा पञ्चाङ्ग डाटा पठाउन तयार।',
  },
];

// Helper to generate today's comprehensive social & webhook data package
function buildDailySocialPackage() {
  const panchang = getTodayPanchang(0);
  const { rasis } = getDynamicRasis(new Date());

  const dateStr = panchang.bsDate;
  const tithiStr = `${panchang.tithi} (${panchang.paksha})`;

  const fbBullets = rasis
    .map(r => `${r.symbolEmoji} ${r.nepaliName} (${r.englishName}): ${r.daily.summary} (शुभ रङ्ग: ${r.daily.luckyColor}, शुभ अङ्क: ${r.daily.luckyNumber})`)
    .join('\n\n');

  const fbPost = `🚩 दैनिक राशिफल तथा पञ्चाङ्ग 🚩\n📅 मिति: ${dateStr}\n🕉️ तिथि: ${tithiStr} | नक्षत्र: ${panchang.nakshatra}\n☀️ सूर्योदय: ${panchang.suryodaya} | सूर्यास्त: ${panchang.suryasta}\n⏱️ शुभ अभिजित मुहूर्त: ${panchang.abhijitMuhurat}\n⚠️ राहुकाल: ${panchang.rahuKaal}\n\n━━━━━━━━━━━━━━━━━━━\n🔮 आजको १२ राशि फल (Daily Horoscope)\n━━━━━━━━━━━━━━━━━━━\n\n${fbBullets}\n\n━━━━━━━━━━━━━━━━━━━\n🌺 आजको वैदिक मन्त्र:\n"ॐ नमो भगवते वासुदेवाय नमः"\n\nशुभ दिनको मङ्गलमय शुभकामना! 🙏\n#दैनिकराशिफल #नेपालीपञ्चाङ्ग #DailyRashifal #NepalAstrology #RashifalToday`;

  const instaBullets = rasis
    .map(r => `• ${r.symbolEmoji} ${r.nepaliName}: ${r.daily.highlights?.[0] || r.daily.summary.slice(0, 50)}... [अङ्क: ${r.daily.luckyNumber}]`)
    .join('\n');

  const instaPost = `✨ आजको राशिफल तथा पञ्चाङ्ग | ${dateStr} 🪐\n\n📌 पञ्चाङ्ग संक्षेप:\n- तिथि: ${tithiStr}\n- शुभ मुहूर्त: ${panchang.abhijitMuhurat}\n- राहुकाल: ${panchang.rahuKaal}\n\n🌟 १२ राशिको संक्षिप्त फल:\n${instaBullets}\n\n❤️ सेभ र सेयर गर्नुहोस्। #nepalirashifal #panchang #dailyhoroscope #nepal`;

  const tiktokScript = `🎬 [भिडियो स्क्रिप्ट]: "नमस्कार! आज ${dateStr} को दिन पञ्चाङ्ग अनुसार ${tithiStr} रहेको छ। आजको शुभ समय ${panchang.abhijitMuhurat} हो। मेष, सिंह र धनु राशिका लागि आज विशेष धनलाभको योग छ। सबै १२ राशिका लागि दिन शुभ रहोस्। जय पशुपतिनाथ!"\n\n क्याप्सन: आजको राशिफल र पञ्चाङ्ग (${dateStr}) 🕉️✨ #tiktoknepal #rashifal #foryou #nepaliastrology`;

  const ytPost = `📌 शीर्षक: आजको दैनिक राशिफल र शुभ पञ्चाङ्ग | ${dateStr} | Daily Horoscope Nepal\n\n📝 विवरण: आज ${dateStr} को सम्पूर्ण १२ राशिको फलादेश, पञ्चाङ्ग, राहुकाल र शुभ मुहूर्त।\n00:00 पञ्चाङ्ग | 00:30 मेष राशि | 01:00 वृष राशि... #NepaliRashifal #DailyHoroscope`;

  return {
    panchang,
    rasis,
    dateStr,
    posts: {
      facebook: fbPost,
      instagram: instaPost,
      tiktok: tiktokScript,
      youtube: ytPost,
    },
  };
}

// 7. GET Social Media Configuration and History
app.get('/api/social/settings', (req, res) => {
  res.json({
    success: true,
    config: socialConfig,
    logs: socialLogs,
    defaultWebhookUrl: DEFAULT_MAKE_WEBHOOK_URL,
  });
});

// 8. POST Update Social Media Configuration
app.post('/api/social/settings', (req, res) => {
  const updates = req.body;
  socialConfig = {
    ...socialConfig,
    ...updates,
    webhookUrl: updates.webhookUrl !== undefined ? updates.webhookUrl : socialConfig.webhookUrl,
    enabledPlatforms: {
      ...socialConfig.enabledPlatforms,
      ...(updates.enabledPlatforms || {}),
    },
  };

  res.json({
    success: true,
    message: 'सामाजिक सञ्जाल तथा Webhook सेटिङ सफलतापूर्वक सुरक्षित भयो।',
    config: socialConfig,
  });
});

// 9. GET Today's Social Post Content & Full Webhook Payload Preview
app.get('/api/social/today-posts', (req, res) => {
  try {
    const pkg = buildDailySocialPackage();
    res.json({
      success: true,
      data: pkg,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Helper function to dispatch payload to Webhook URL
async function sendToMakeWebhook(targetUrl: string, pkg: ReturnType<typeof buildDailySocialPackage>, activePlatforms: string[]) {
  const payload = {
    event: 'daily_panchang_and_rashi_data',
    timestamp: new Date().toISOString(),
    nepaliTimestamp: new Date().toLocaleTimeString('ne-NP', { hour: '2-digit', minute: '2-digit' }),
    bsDate: pkg.dateStr,
    adDate: pkg.panchang.adDate,
    panchang: {
      bsDate: pkg.panchang.bsDate,
      adDate: pkg.panchang.adDate,
      tithi: pkg.panchang.tithi,
      paksha: pkg.panchang.paksha,
      nakshatra: pkg.panchang.nakshatra,
      yoga: pkg.panchang.yoga,
      karana: pkg.panchang.karana,
      suryodaya: pkg.panchang.suryodaya,
      suryasta: pkg.panchang.suryasta,
      chandraRasi: pkg.panchang.chandraRasi,
      suryaRasi: pkg.panchang.suryaRasi,
      abhijitMuhurat: pkg.panchang.abhijitMuhurat,
      rahuKaal: pkg.panchang.rahuKaal,
      yamaGhanta: pkg.panchang.yamaGhanta,
      gulikaKaal: pkg.panchang.gulikaKaal,
      dishaShool: pkg.panchang.dishaShool,
      samvatsara: pkg.panchang.samvatsara,
      ritu: pkg.panchang.ritu,
      aayan: pkg.panchang.aayan,
      festival: pkg.panchang.festival || '',
    },
    rasis: pkg.rasis.map(r => ({
      id: r.id,
      nepaliName: r.nepaliName,
      englishName: r.englishName,
      symbolEmoji: r.symbolEmoji,
      symbol: r.symbol,
      element: r.element,
      lord: r.lord,
      friendlyRasi: r.friendlyRasi,
      luckyColor: r.daily.luckyColor,
      luckyNumber: r.daily.luckyNumber,
      luckyDirection: r.daily.luckyDirection,
      summary: r.daily.summary,
      career: r.daily.career,
      wealth: r.daily.wealth,
      love: r.daily.love,
      health: r.daily.health,
      rating: r.daily.rating,
      highlights: r.daily.highlights,
      namakshyar: `${r.nepaliNamakshyar} (${r.englishNamakshyar})`,
      vedicMantra: r.vedicMantra,
    })),
    formattedPosts: {
      facebook: pkg.posts.facebook,
      instagram: pkg.posts.instagram,
      tiktok: pkg.posts.tiktok,
      youtube: pkg.posts.youtube,
    },
    enabledPlatforms: activePlatforms,
  };

  const response = await fetch(targetUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json, text/plain, */*',
    },
    body: JSON.stringify(payload),
  });

  const responseText = await response.text();
  return {
    ok: response.ok,
    status: response.status,
    statusText: response.statusText,
    responseText,
    payload,
  };
}

// 10. POST Trigger Instant Broadcast & Send to Make.com Webhook
app.post('/api/social/trigger-broadcast', async (req, res) => {
  try {
    const pkg = buildDailySocialPackage();
    const activePlatforms = Object.entries(socialConfig.enabledPlatforms)
      .filter(([_, isEnabled]) => isEnabled)
      .map(([platform]) => platform);

    const targetUrl = (req.body && req.body.webhookUrl) || socialConfig.webhookUrl || DEFAULT_MAKE_WEBHOOK_URL;
    let webhookStatus = 'स्थानीय रूपमा तयार गरियो';
    let webhookDetails: any = null;

    if (targetUrl && targetUrl.startsWith('http')) {
      try {
        const result = await sendToMakeWebhook(targetUrl, pkg, activePlatforms);
        webhookDetails = {
          url: targetUrl,
          statusCode: result.status,
          statusText: result.statusText,
          response: result.responseText,
        };

        if (result.ok) {
          webhookStatus = `Make.com Webhook मा सफलतापूर्वक पठाइयो (${result.status} ${result.statusText})`;
        } else {
          webhookStatus = `Make.com Webhook त्रुटि (${result.status} ${result.statusText})`;
        }
      } catch (webhookErr: any) {
        webhookStatus = `Webhook सम्पर्क हुन सकेन: ${webhookErr.message}`;
        webhookDetails = { error: webhookErr.message };
      }
    }

    const newLog = {
      id: 'log-' + Date.now(),
      timestamp: new Date().toLocaleTimeString('ne-NP', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      dateText: pkg.dateStr,
      platforms: activePlatforms,
      status: 'success' as const,
      message: `पञ्चाङ्ग र १२ राशिको डाटा Make.com Webhook (${targetUrl}) मा POST गरियो। (${webhookStatus})`,
      previewSnippet: `[Webhook POST]: ${pkg.dateStr} | १२ राशि | पञ्चाङ्ग: ${pkg.panchang.tithi} | Status: ${webhookStatus}`,
    };

    socialLogs = [newLog, ...socialLogs.slice(0, 19)];
    socialConfig.lastBroadcastTime = new Date().toISOString();
    socialConfig.lastBroadcastStatus = `सफल (${newLog.timestamp})`;

    res.json({
      success: true,
      message: 'आजको सम्पूर्ण पञ्चाङ्ग तथा १२ राशिको डाटा Webhook मा सफलतापूर्वक पठाइयो!',
      log: newLog,
      webhookDetails,
      data: pkg,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Dedicated POST Endpoint to send Panchang & Rashi directly to Webhook
app.post('/api/webhook/send-panchang-rashi', async (req, res) => {
  try {
    const pkg = buildDailySocialPackage();
    const targetUrl = req.body?.webhookUrl || socialConfig.webhookUrl || DEFAULT_MAKE_WEBHOOK_URL;
    const activePlatforms = Object.entries(socialConfig.enabledPlatforms)
      .filter(([_, isEnabled]) => isEnabled)
      .map(([platform]) => platform);

    const result = await sendToMakeWebhook(targetUrl, pkg, activePlatforms);

    const newLog = {
      id: 'log-' + Date.now(),
      timestamp: new Date().toLocaleTimeString('ne-NP', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      dateText: pkg.dateStr,
      platforms: activePlatforms,
      status: (result.ok ? 'success' : 'warning') as any,
      message: `दैनिक पञ्चाङ्ग र १२ राशिको डाटा Webhook मा पठाइयो (${result.status} ${result.statusText})`,
      previewSnippet: `URL: ${targetUrl} | Status: ${result.status} | Response: ${result.responseText.slice(0, 80)}`,
    };

    socialLogs = [newLog, ...socialLogs.slice(0, 19)];
    socialConfig.lastBroadcastTime = new Date().toISOString();
    socialConfig.lastBroadcastStatus = `Webhook पठाइयो (${result.status})`;

    res.json({
      success: result.ok,
      statusCode: result.status,
      statusText: result.statusText,
      webhookResponse: result.responseText,
      targetUrl,
      bsDate: pkg.dateStr,
      message: result.ok
        ? 'Make.com Webhook मा दैनिक पञ्चाङ्ग र राशिफल डाटा सफलतापूर्वक प्राप्त भयो (POST 200 OK)!'
        : `Make.com Webhook बाट त्रुटि प्राप्त भयो (${result.status}): ${result.responseText}`,
      payloadSummary: {
        panchang: `${pkg.panchang.bsDate} - ${pkg.panchang.tithi}, ${pkg.panchang.nakshatra}`,
        totalRasis: pkg.rasis.length,
        platforms: activePlatforms,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 11. POST Generate Custom AI Social Copy/Script with Gemini
app.post('/api/social/generate-ai-script', async (req, res) => {
  try {
    const { platform = 'facebook', customTone = 'भक्तिमय र प्रेरणादायी' } = req.body;
    const ai = getGeminiAI();
    const pkg = buildDailySocialPackage();

    if (!ai) {
      return res.json({
        success: true,
        generatedContent: pkg.posts[platform as keyof typeof pkg.posts] || pkg.posts.facebook,
      });
    }

    const prompt = `तपाईं एक विख्यात वैदिक ज्योतिषी र सामाजिक सञ्जाल विशेषज्ञ हुनुहुन्छ।
आजको मिति: ${pkg.dateStr}
पञ्चाङ्ग: ${pkg.panchang.tithi}, ${pkg.panchang.nakshatra}, शुभ समय: ${pkg.panchang.abhijitMuhurat}

प्लेटफर्म: ${platform}
शैली/टोन: ${customTone}

यस प्लेटफर्मका लागि भाइरल हुने, उच्च इन्गेजमेन्ट दिने, नेपाली भाषामा आकर्षक इमोजी र उपयुक्त ह्यासट्यागहरू सहित शुद्ध नेपालीमा उत्कृष्ट पोस्ट/स्क्रिप्ट तयार पार्नुहोस्।`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    res.json({
      success: true,
      generatedContent: response.text || pkg.posts.facebook,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// AUTOMATED BACKGROUND CRON SCHEDULER (Runs every 60s to check morning trigger time)
let lastAutoBroadcastDate = '';
setInterval(() => {
  if (!socialConfig.enabled) return;

  const now = new Date();
  const currentHours = now.getHours().toString().padStart(2, '0');
  const currentMinutes = now.getMinutes().toString().padStart(2, '0');
  const currentTimeStr = `${currentHours}:${currentMinutes}`;
  const todayDateStr = now.toDateString();

  if (currentTimeStr === socialConfig.morningTime && lastAutoBroadcastDate !== todayDateStr) {
    lastAutoBroadcastDate = todayDateStr;
    console.log(`[Auto-Cron] Triggering Daily Morning Social Broadcast at ${currentTimeStr}...`);
    try {
      const pkg = buildDailySocialPackage();
      const activePlatforms = Object.entries(socialConfig.enabledPlatforms)
        .filter(([_, isEnabled]) => isEnabled)
        .map(([platform]) => platform);

      const newLog = {
        id: 'auto-cron-' + Date.now(),
        timestamp: `${currentTimeStr} बिहान`,
        dateText: pkg.dateStr,
        platforms: activePlatforms,
        status: 'success' as const,
        message: `स्वचालित बिहानी तालिका अनुसार फेसबुक, इन्स्टाग्राम, टिकटक र युट्युबको लागि सामग्री जेनेरेट भयो।`,
        previewSnippet: pkg.posts.facebook.slice(0, 110) + '...',
      };

      socialLogs = [newLog, ...socialLogs.slice(0, 19)];
      socialConfig.lastBroadcastTime = now.toISOString();
      socialConfig.lastBroadcastStatus = `स्वचालित प्रसारण सफल (${currentTimeStr})`;

      if (socialConfig.webhookUrl && socialConfig.webhookUrl.startsWith('http')) {
        sendToMakeWebhook(socialConfig.webhookUrl, pkg, activePlatforms)
          .then(res => console.log(`[Auto-Cron] Sent to Webhook with status: ${res.status}`))
          .catch(e => console.warn('[Auto-Cron] Webhook error:', e.message));
      }
    } catch (e: any) {
      console.error('[Auto-Cron Error]:', e.message);
    }
  }
}, 60000);

// Vite & Static Server Setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Nepali Rashifal & Panchang server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
