import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Modality } from '@google/genai';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { allRasis } from './src/data/horoscopeData';
import { getDynamicRasis } from './src/data/horoscopeEngine';
import { getTodayPanchang } from './src/data/panchangData';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
