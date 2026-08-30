import React, { useState } from 'react';
import { RasiInfo, HoroscopePeriod } from '../types';
import { Compass, Sparkles, Send, Bot, User, CheckCircle2, RefreshCw, Star } from 'lucide-react';
import { playTempleBell, playOmChime } from '../utils/audio';

interface AIAstrologerModalProps {
  rasis: RasiInfo[];
  onConsultAI: (
    rasiId: string, 
    period: HoroscopePeriod, 
    question: string,
    birthDetails?: { birthDate: string; birthTime: string; birthPlace: string }
  ) => Promise<any>;
}

export const AIAstrologerModal: React.FC<AIAstrologerModalProps> = ({
  rasis,
  onConsultAI,
}) => {
  const [selectedRasiId, setSelectedRasiId] = useState<string>('mesh');
  const [period, setPeriod] = useState<HoroscopePeriod>('daily');
  const [question, setQuestion] = useState<string>('');
  const [birthDate, setBirthDate] = useState<string>('');
  const [birthTime, setBirthTime] = useState<string>('');
  const [birthPlace, setBirthPlace] = useState<string>('Kathmandu, Nepal');
  const [loading, setLoading] = useState<boolean>(false);
  const [predictionResult, setPredictionResult] = useState<any>(null);

  const predefinedQuestions = [
    'आज मेरो नयाँ काम वा व्यवसाय सुरु गर्ने योग कस्तो छ?',
    'यो साता वैदेशिक यात्रा वा भिसा सम्बन्धी काम बन्ला कि नबन्ला?',
    'मेरो राशिको आर्थिक अवस्था सुधारका लागि कुन वैदिक उपाय सर्वोत्तम छ?',
    'यो महिना प्रेम तथा वैवाहिक सम्बन्धमा कस्तो प्रभाव रहला?'
  ];

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    playTempleBell();
    try {
      const res = await onConsultAI(selectedRasiId, period, question, {
        birthDate,
        birthTime,
        birthPlace
      });
      setPredictionResult(res);
      playOmChime();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const selectedRasi = rasis.find(r => r.id === selectedRasiId) || rasis[0];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Astrologer Hero Header */}
      <div className="bg-gradient-to-br from-[#1d1630] via-[#141624] to-[#1d1222] border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold mb-3 border border-amber-500/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>प्रत्यक्ष वैदिक ज्योतिषी परामर्श (Live Astrological AI Consultation)</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-amber-100 tracking-tight">
            आफ्नो राशि र कुण्डली सम्बन्धी कुनै पनि जिज्ञासा सोध्नुहोस्
          </h2>
          <p className="text-zinc-300 text-sm sm:text-base mt-2">
            ग्रह गोचर, दशा, नक्षत्र तथा वैदिक ज्योतिष सिद्धान्त अनुसार तत्काल प्रमाणित परामर्श, शुभ मुहूर्त र उपाय प्राप्त गर्नुहोस्।
          </p>
        </div>
      </div>

      {/* Consultation Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-[#131522] border border-amber-500/20 rounded-3xl p-6 shadow-xl space-y-5">
          <h3 className="font-bold text-amber-200 text-lg flex items-center gap-2">
            <Compass className="w-5 h-5 text-amber-400" />
            <span>विवरण छनोट गर्नुहोस्</span>
          </h3>

          {/* Rasi Selector */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              आफ्नो राशि छान्नुहोस्:
            </label>
            <select
              value={selectedRasiId}
              onChange={(e) => setSelectedRasiId(e.target.value)}
              className="w-full bg-black/50 text-amber-100 text-sm rounded-xl border border-amber-500/30 px-3.5 py-3 focus:outline-none focus:border-amber-400"
            >
              {rasis.map((r) => (
                <option key={r.id} value={r.id} className="bg-[#141624] text-white">
                  {r.symbol} {r.nepaliName} ({r.englishName}) - {r.nepaliNamakshyar}
                </option>
              ))}
            </select>
          </div>

          {/* Period Selector */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              समयावधि:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['daily', 'weekly', 'monthly', 'yearly'] as HoroscopePeriod[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPeriod(p)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                    period === p
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                      : 'bg-black/30 text-zinc-400 hover:text-white border border-white/5'
                  }`}
                >
                  {p === 'daily' ? 'दैनिक' : p === 'weekly' ? 'साप्ताहिक' : p === 'monthly' ? 'मासिक' : 'वार्षिक'}
                </button>
              ))}
            </div>
          </div>

          {/* Optional Birth Details */}
          <div className="border-t border-white/10 pt-4 space-y-3">
            <div className="text-xs font-semibold text-amber-300">
              ऐच्छिक जन्म विवरण (थप सटिकताका लागि):
            </div>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full bg-black/40 text-xs text-zinc-300 rounded-xl border border-white/10 p-2.5"
              placeholder="जन्म मिति"
            />
            <input
              type="text"
              value={birthPlace}
              onChange={(e) => setBirthPlace(e.target.value)}
              className="w-full bg-black/40 text-xs text-zinc-300 rounded-xl border border-white/10 p-2.5"
              placeholder="जन्म स्थान (उदा: काठमाडौँ)"
            />
          </div>
        </div>

        {/* Question & Interactive Chat Input */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSubmit} className="bg-[#131522] border border-amber-500/20 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-amber-200 text-lg flex items-center gap-2">
                <Bot className="w-5 h-5 text-amber-400" />
                <span>तपाईंको जिज्ञासा (Ask your query)</span>
              </h3>
              <span className="text-xs text-zinc-400">
                {selectedRasi.nepaliName} • {selectedRasi.nepaliNamakshyar}
              </span>
            </div>

            {/* Quick Predefined Questions */}
            <div className="flex flex-wrap gap-2">
              {predefinedQuestions.map((pq, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setQuestion(pq)}
                  className="text-left text-xs bg-amber-500/10 hover:bg-amber-500/20 text-amber-200/90 border border-amber-500/20 rounded-xl px-3 py-1.5 transition-colors cursor-pointer"
                >
                  &ldquo;{pq}&rdquo;
                </button>
              ))}
            </div>

            <div className="relative">
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                rows={3}
                placeholder="यहाँ आफ्नो प्रश्न लेख्नुहोस् (उदा: आज व्यापारमा लगानी गर्न उपयुक्त छ कि छैन? मेरो राशिको के उपाय गर्नुपर्ला?)"
                className="w-full bg-black/50 text-amber-100 text-sm rounded-2xl border border-amber-500/30 p-4 focus:outline-none focus:border-amber-400 placeholder:text-zinc-500"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading || !question.trim()}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/30 flex items-center gap-2 cursor-pointer disabled:opacity-50 transition-all transform hover:scale-[1.02]"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>ज्योतिषीय गणना हुँदैछ...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>परामर्श लिनुहोस्</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* AI Response Display */}
          {predictionResult && (
            <div className="bg-gradient-to-br from-[#1c1830] via-[#141626] to-[#1e1322] border-2 border-amber-400/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 animate-scaleUp">
              <div className="flex items-center justify-between border-b border-amber-500/20 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xl">
                    ॐ
                  </div>
                  <div>
                    <h4 className="font-extrabold text-amber-100 text-lg">
                      ज्योतिषाचार्यको विश्लेषण ({selectedRasi.nepaliName})
                    </h4>
                    <span className="text-xs text-amber-300/70">
                      ग्रहगोचर तथा वैदिक सिद्धान्त अनुसार
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 bg-black/40 px-3 py-1.5 rounded-xl border border-white/5">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-bold text-amber-200">
                    मूल्याङ्कन: {predictionResult.data?.prediction?.rating || 5}/5
                  </span>
                </div>
              </div>

              {/* Main Summary */}
              <div className="p-4 rounded-2xl bg-black/40 border border-amber-500/20 space-y-2">
                <div className="text-xs font-semibold text-amber-400">विस्तृत परामर्श तथा भविष्यवाणी:</div>
                <p className="text-zinc-200 text-sm sm:text-base leading-relaxed">
                  {predictionResult.data?.prediction?.summary}
                </p>
              </div>

              {/* Specific Areas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs sm:text-sm">
                <div className="p-3.5 rounded-xl bg-black/30 border border-white/5">
                  <strong className="text-amber-300 block mb-1">💼 पेशा तथा व्यवसाय:</strong>
                  <span className="text-zinc-300">{predictionResult.data?.prediction?.career}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-black/30 border border-white/5">
                  <strong className="text-emerald-300 block mb-1">💰 आर्थिक स्थिति:</strong>
                  <span className="text-zinc-300">{predictionResult.data?.prediction?.wealth}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-black/30 border border-white/5">
                  <strong className="text-rose-300 block mb-1">❤️ प्रेम र सम्बन्ध:</strong>
                  <span className="text-zinc-300">{predictionResult.data?.prediction?.love}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-black/30 border border-white/5">
                  <strong className="text-blue-300 block mb-1">🧘 स्वास्थ्य:</strong>
                  <span className="text-zinc-300">{predictionResult.data?.prediction?.health}</span>
                </div>
              </div>

              {/* Vedic Remedy & Mantra */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                <div className="text-xs font-bold text-amber-300">
                  ॐ सिफारिस गरिएको वैदिक उपाय र मन्त्र:
                </div>
                <div className="text-sm font-serif font-bold text-amber-100">
                  {predictionResult.data?.prediction?.mantra || selectedRasi.vedicMantra}
                </div>
                <p className="text-xs text-zinc-300">
                  {predictionResult.data?.prediction?.remedies}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
