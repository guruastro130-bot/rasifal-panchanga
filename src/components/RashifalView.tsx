import React, { useState } from 'react';
import { RasiInfo, HoroscopePeriod, HoroscopeSection } from '../types';
import { 
  Sparkles, Star, Volume2, VolumeX, 
  Compass, Heart, Briefcase, DollarSign, 
  Activity, ShieldAlert, CheckCircle2
} from 'lucide-react';
import { playTempleBell, playOmChime, speakHoroscopeText } from '../utils/audio';
import { getNepaliDate, NepaliDateInfo } from '../utils/nepaliCalendar';

interface RashifalViewProps {
  rasis: RasiInfo[];
  period: HoroscopePeriod;
  onPeriodChange: (period: HoroscopePeriod) => void;
  targetDate?: Date;
}

export const RashifalView: React.FC<RashifalViewProps> = ({
  rasis,
  period,
  onPeriodChange,
  targetDate = new Date()
}) => {
  const [selectedRasiId, setSelectedRasiId] = useState<string>('mesh');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [stopSpeechFn, setStopSpeechFn] = useState<(() => void) | null>(null);
  const [copiedMantra, setCopiedMantra] = useState<boolean>(false);

  const nepaliDate: NepaliDateInfo = getNepaliDate(targetDate);
  const selectedRasi = rasis.find(r => r.id === selectedRasiId) || rasis[0];

  const activeHoroscope: HoroscopeSection = 
    selectedRasi[period] ||
    selectedRasi.daily;

  const handleSpeechToggle = () => {
    if (isSpeaking) {
      if (stopSpeechFn) stopSpeechFn();
      setIsSpeaking(false);
      setStopSpeechFn(null);
    } else {
      const periodNe = period === 'daily' ? 'दैनिक' : period === 'weekly' ? 'साप्ताहिक' : period === 'monthly' ? 'मासिक' : 'वार्षिक';
      const textToRead = `ॐ। ${selectedRasi.nepaliName}, ${periodNe} राशिफल। ${activeHoroscope.summary} पेशा तथा व्यवसाय: ${activeHoroscope.career}। आर्थिक तथा धन लाभ: ${activeHoroscope.wealth}। प्रेम तथा पारिवारिक सम्बन्ध: ${activeHoroscope.love}। स्वास्थ्य: ${activeHoroscope.health}। शुभ रङ्ग ${activeHoroscope.luckyColor}, र शुभ अङ्क ${activeHoroscope.luckyNumber} रहेको छ। जय श्री पशुपतिनाथ।`;
      
      const stop = speakHoroscopeText(textToRead, () => {
        setIsSpeaking(false);
        setStopSpeechFn(null);
      });
      setIsSpeaking(true);
      setStopSpeechFn(() => stop);
    }
  };

  const handleCopyMantra = (mantra: string) => {
    navigator.clipboard.writeText(mantra);
    setCopiedMantra(true);
    playOmChime();
    setTimeout(() => setCopiedMantra(false), 2500);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Clean Period Selector Tabs */}
      <div className="bg-[#141624] border border-amber-500/20 p-2 sm:p-2.5 rounded-2xl shadow-xl flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
        <div className="grid grid-cols-4 gap-2 w-full">
          {/* 1. Daily */}
          <button
            onClick={() => {
              onPeriodChange('daily');
              playTempleBell();
            }}
            className={`py-3 px-4 rounded-xl text-center transition-all cursor-pointer text-xs sm:text-sm font-bold ${
              period === 'daily'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/30'
                : 'text-zinc-300 hover:text-amber-200 hover:bg-white/5'
            }`}
          >
            दैनिक राशिफल
          </button>

          {/* 2. Weekly */}
          <button
            onClick={() => {
              onPeriodChange('weekly');
              playTempleBell();
            }}
            className={`py-3 px-4 rounded-xl text-center transition-all cursor-pointer text-xs sm:text-sm font-bold ${
              period === 'weekly'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/30'
                : 'text-zinc-300 hover:text-amber-200 hover:bg-white/5'
            }`}
          >
            साप्ताहिक फल
          </button>

          {/* 3. Monthly */}
          <button
            onClick={() => {
              onPeriodChange('monthly');
              playTempleBell();
            }}
            className={`py-3 px-4 rounded-xl text-center transition-all cursor-pointer text-xs sm:text-sm font-bold ${
              period === 'monthly'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/30'
                : 'text-zinc-300 hover:text-amber-200 hover:bg-white/5'
            }`}
          >
            मासिक फल
          </button>

          {/* 4. Yearly */}
          <button
            onClick={() => {
              onPeriodChange('yearly');
              playTempleBell();
            }}
            className={`py-3 px-4 rounded-xl text-center transition-all cursor-pointer text-xs sm:text-sm font-bold ${
              period === 'yearly'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/30'
                : 'text-zinc-300 hover:text-amber-200 hover:bg-white/5'
            }`}
          >
            वार्षिक फल
          </button>
        </div>
      </div>

      {/* 12 Rasi Selector Cards Grid (With Namakshyar on top of every Rasi in Nepali & English) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-amber-200 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span>१२ राशि</span>
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {rasis.map((rasi) => {
            const isSelected = rasi.id === selectedRasiId;
            return (
              <div
                key={rasi.id}
                onClick={() => {
                  setSelectedRasiId(rasi.id);
                  playTempleBell();
                }}
                className={`relative cursor-pointer rounded-2xl p-3.5 transition-all duration-200 border flex flex-col justify-between group text-left ${
                  isSelected
                    ? 'bg-gradient-to-b from-[#241f38] to-[#171424] border-amber-400 shadow-lg shadow-amber-500/20 scale-[1.02]'
                    : 'bg-[#121420] border-amber-500/20 hover:border-amber-500/50 hover:bg-[#181a2b]'
                }`}
              >
                {/* TOP SECTION: Arranged Namakshyar in Nepali & English */}
                <div className="border-b border-amber-500/20 pb-2 mb-2 bg-black/30 -mx-3.5 -mt-3.5 p-2.5 rounded-t-2xl">
                  <div className="text-[11px] font-bold text-amber-300 truncate leading-tight" title={rasi.nepaliNamakshyar}>
                    {rasi.nepaliNamakshyar}
                  </div>
                  <div className="text-[10px] text-zinc-400 truncate leading-tight font-sans" title={rasi.englishNamakshyar}>
                    {rasi.englishNamakshyar}
                  </div>
                </div>

                {/* MIDDLE & BOTTOM: Rasi Icon, Name & Lord */}
                <div className="flex items-center justify-between gap-2 my-1">
                  <div>
                    <div className="text-sm font-extrabold text-white group-hover:text-amber-300 transition-colors">
                      {rasi.nepaliName}
                    </div>
                    <div className="text-[11px] text-amber-200/60 font-sans">
                      {rasi.englishName}
                    </div>
                  </div>
                  <span className="text-2xl select-none group-hover:scale-110 transition-transform">
                    {rasi.symbol}
                  </span>
                </div>

                <div className="mt-2 pt-1.5 border-t border-white/5 flex items-center justify-between text-[10px] text-zinc-400">
                  <span>स्वामी: {rasi.lord.split(' ')[0]}</span>
                  <span className="text-amber-400 font-semibold">{rasi.element.split(' ')[0]}</span>
                </div>

                {isSelected && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full shadow-md animate-pulse"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* DETAILED RASHIFAL DISPLAY FOR SELECTED RASI */}
      <div className="relative bg-gradient-to-br from-[#1a172c] via-[#131525] to-[#1b1220] border-2 border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Selected Rasi Header & Namakshyar Section */}
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-amber-500/20">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-amber-500 via-amber-600 to-red-700 flex items-center justify-center text-3xl sm:text-4xl shadow-xl shadow-amber-600/30 border border-amber-300/40 shrink-0">
              {selectedRasi.symbol}
            </div>

            <div>
              {/* Namakshyar display above/with Rasi details */}
              <div className="inline-block px-3 py-1 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-200 text-xs font-semibold mb-2">
                <span className="text-amber-400 font-bold">नामाक्षर: </span>
                <span>{selectedRasi.nepaliNamakshyar}</span>
                <span className="text-zinc-400 ml-1.5 font-sans">({selectedRasi.englishNamakshyar})</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-amber-100 flex flex-wrap items-center gap-3">
                <span>{selectedRasi.nepaliName}</span>
                <span className="text-lg sm:text-xl font-normal text-amber-300/80 font-sans">
                  ({selectedRasi.englishName})
                </span>
                <span className="text-xs sm:text-sm px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">
                  {period === 'daily' && `दैनिक फल • ${nepaliDate.bsFormatted}`}
                  {period === 'weekly' && `साप्ताहिक फल • ${nepaliDate.weeklyRangeText}`}
                  {period === 'monthly' && `मासिक फल • ${nepaliDate.bsMonthNameNe} महिना`}
                  {period === 'yearly' && `वार्षिक फल • वर्ष ${nepaliDate.bsYear}`}
                </span>
              </h2>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-zinc-300">
                <span><strong className="text-amber-300">स्वामी ग्रह:</strong> {selectedRasi.lord}</span>
                <span><strong className="text-amber-300">तत्व:</strong> {selectedRasi.element}</span>
                <span><strong className="text-amber-300">मित्र राशि:</strong> {selectedRasi.friendlyRasi}</span>
              </div>
            </div>
          </div>

          {/* Action Button: Audio Recitation only */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleSpeechToggle}
              className={`px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isSpeaking
                  ? 'bg-rose-600 text-white border-rose-400 animate-pulse'
                  : 'bg-black/40 text-amber-200 border-amber-500/30 hover:bg-amber-500/20'
              }`}
            >
              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
              <span>{isSpeaking ? 'वाचन रोक्नुहोस्' : 'राशिफल सुन्नुहोस्'}</span>
            </button>
          </div>
        </div>

        {/* STAR RATING & QUICK HIGHLIGHTS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Rating */}
          <div className="bg-black/30 border border-amber-500/20 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <div className="text-xs text-zinc-400 font-medium">भाग्य मूल्याङ्कन</div>
              <div className="text-sm font-bold text-amber-200 mt-0.5">
                {activeHoroscope.rating >= 4 ? 'अति उत्तम / शुभ योग' : 'मध्यम फलदायी'}
              </div>
            </div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < activeHoroscope.rating ? 'fill-amber-400 text-amber-400' : 'text-zinc-600'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Lucky Color & Number */}
          <div className="bg-black/30 border border-amber-500/20 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <div className="text-xs text-zinc-400 font-medium">शुभ रङ्ग र अङ्क</div>
              <div className="text-sm font-bold text-amber-300 mt-0.5">
                {activeHoroscope.luckyColor}
              </div>
            </div>
            <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 font-bold text-sm border border-amber-500/30">
              अङ्क: {activeHoroscope.luckyNumber}
            </span>
          </div>

          {/* Lucky Direction */}
          <div className="bg-black/30 border border-amber-500/20 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <div className="text-xs text-zinc-400 font-medium">शुभ दिशा</div>
              <div className="text-sm font-bold text-amber-200 mt-0.5">
                {activeHoroscope.luckyDirection}
              </div>
            </div>
            <Compass className="w-6 h-6 text-amber-400" />
          </div>
        </div>

        {/* COMPREHENSIVE HOROSCOPE BREAKDOWN */}
        <div className="space-y-4">
          {/* 1. Overall Summary */}
          <div className="bg-gradient-to-r from-amber-500/10 via-[#151726] to-transparent border border-amber-500/25 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-base">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span>समग्र फल</span>
              </div>
            </div>
            <p className="text-zinc-200 text-sm sm:text-base leading-relaxed">
              {activeHoroscope.summary}
            </p>
            {activeHoroscope.highlights && (
              <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-white/5">
                {activeHoroscope.highlights.map((h, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-amber-500/15 text-amber-300 text-xs font-medium flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>{h}</span>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 2. Career & Business vs Wealth & Finance */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Career & Business */}
            <div className="bg-[#121420] border border-amber-500/20 rounded-2xl p-5 shadow-lg space-y-2">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                <Briefcase className="w-4 h-4 text-amber-400" />
                <span>पेशा, व्यवसाय तथा रोजगार</span>
              </div>
              <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed">
                {activeHoroscope.career}
              </p>
            </div>

            {/* Wealth & Finance */}
            <div className="bg-[#121420] border border-amber-500/20 rounded-2xl p-5 shadow-lg space-y-2">
              <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span>आर्थिक स्थिति तथा धनलाभ</span>
              </div>
              <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed">
                {activeHoroscope.wealth}
              </p>
            </div>
          </div>

          {/* 3. Love & Relationship vs Health & Vitality */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Love & Family */}
            <div className="bg-[#121420] border border-amber-500/20 rounded-2xl p-5 shadow-lg space-y-2">
              <div className="flex items-center gap-2 text-rose-300 font-bold text-sm">
                <Heart className="w-4 h-4 text-rose-400" />
                <span>प्रेम तथा पारिवारिक सम्बन्ध</span>
              </div>
              <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed">
                {activeHoroscope.love}
              </p>
            </div>

            {/* Health & Vitality */}
            <div className="bg-[#121420] border border-amber-500/20 rounded-2xl p-5 shadow-lg space-y-2">
              <div className="flex items-center gap-2 text-blue-300 font-bold text-sm">
                <Activity className="w-4 h-4 text-blue-400" />
                <span>स्वास्थ्य तथा तन्दुरुस्ती</span>
              </div>
              <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed">
                {activeHoroscope.health}
              </p>
            </div>
          </div>

          {/* 4. Travel & Family Highlights (if present) */}
          {activeHoroscope.travelOrFamily && (
            <div className="bg-[#121420] border border-amber-500/20 rounded-2xl p-5 shadow-lg space-y-2">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                <Compass className="w-4 h-4 text-amber-400" />
                <span>यात्रा तथा सामाजिक सम्बन्ध</span>
              </div>
              <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed">
                {activeHoroscope.travelOrFamily}
              </p>
            </div>
          )}

          {/* 5. Sacred Mantra & Vedic Remedies */}
          <div className="bg-gradient-to-br from-[#1d172e] to-[#151224] border border-amber-500/30 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-base">
                <ShieldAlert className="w-5 h-5 text-amber-400" />
                <span>वैदिक मन्त्र र ज्योतिषीय उपाय</span>
              </div>
            </div>

            {/* Mantra Card */}
            <div className="p-4 rounded-xl bg-black/50 border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <div className="text-xs text-amber-400 font-semibold mb-1">
                  {selectedRasi.nepaliName}को बीज / मन्त्र:
                </div>
                <div className="text-base sm:text-lg font-serif font-bold text-amber-100 tracking-wide">
                  {activeHoroscope.mantra || selectedRasi.vedicMantra}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => playOmChime()}
                  className="px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/30 text-amber-300 text-xs font-semibold border border-amber-500/30 flex items-center gap-1 cursor-pointer"
                  title="मन्त्र ध्वनी सुन्नुहोस्"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>ॐ ध्वनि</span>
                </button>
                <button
                  onClick={() => handleCopyMantra(activeHoroscope.mantra || selectedRasi.vedicMantra)}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  {copiedMantra ? 'कपी भयो ✓' : 'मन्त्र कपी'}
                </button>
              </div>
            </div>

            {/* Remedies */}
            <div className="p-4 rounded-xl bg-black/30 border border-white/5 text-xs sm:text-sm text-zinc-300 space-y-1">
              <span className="font-bold text-amber-300">उपाय: </span>
              <span>{activeHoroscope.remedies}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
