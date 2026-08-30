import React, { useState } from 'react';
import { PanchangInfo } from '../types';
import { 
  Sun, Moon, Compass, AlertTriangle, CheckCircle2, 
  CalendarDays, ChevronLeft, ChevronRight, Sparkles, 
  ShieldCheck, Flame, Wind, Clock
} from 'lucide-react';
import { playTempleBell } from '../utils/audio';

interface PanchangViewProps {
  panchang: PanchangInfo;
  dateOffset: number;
  onDateOffsetChange: (offset: number) => void;
  onNavigateToRashifal: () => void;
}

export const PanchangView: React.FC<PanchangViewProps> = ({
  panchang,
  dateOffset,
  onDateOffsetChange,
  onNavigateToRashifal,
}) => {
  const [selectedCity, setSelectedCity] = useState('काठमाडौँ (Kathmandu, Nepal)');

  const cities = [
    'काठमाडौँ (Kathmandu, Nepal)',
    'पोखरा (Pokhara, Nepal)',
    'विराटनगर (Biratnagar, Nepal)',
    'बुटवल / भैरहवा (Butwal, Nepal)',
    'नेपालगञ्ज (Nepalgunj, Nepal)',
    'धनगढी (Dhangadhi, Nepal)',
    'नयाँ दिल्ली (New Delhi, India)',
    'लण्डन (London, UK)',
    'न्युयोर्क (New York, USA)',
    'सिड्नी (Sydney, Australia)'
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Header Card with Date Controls */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a1728] via-[#141624] to-[#1a1218] border border-amber-500/30 p-6 sm:p-8 shadow-2xl">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-red-600/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                दैनिक प्रत्यक्ष पञ्चाङ्ग (Live Vedic Panchang)
              </span>
              <span className="text-xs text-zinc-400">विक्रम संवत् तथा सूर्य सिद्धान्त</span>
            </div>
            
            <h2 className="text-2xl sm:text-4xl font-extrabold text-amber-100 tracking-tight">
              {panchang.bsDate}
            </h2>
            <p className="text-sm sm:text-base text-amber-300/80 mt-1 font-medium">
              {panchang.adDate} &bull; {panchang.samvatsara} &bull; {panchang.ritu}
            </p>
          </div>

          {/* Date Offset Switcher */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-1 bg-black/40 p-1 rounded-2xl border border-amber-500/20 backdrop-blur-sm">
              <button
                onClick={() => {
                  onDateOffsetChange(dateOffset - 1);
                  playTempleBell();
                }}
                className="px-3 py-2 rounded-xl text-xs font-medium text-zinc-300 hover:text-amber-300 hover:bg-white/5 transition-all flex items-center gap-1"
                title="हिजोको पञ्चाङ्ग (Yesterday)"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>हिजो</span>
              </button>

              <button
                onClick={() => {
                  onDateOffsetChange(0);
                  playTempleBell();
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  dateOffset === 0
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                    : 'text-zinc-300 hover:text-amber-300 hover:bg-white/5'
                }`}
              >
                आज (Today)
              </button>

              <button
                onClick={() => {
                  onDateOffsetChange(dateOffset + 1);
                  playTempleBell();
                }}
                className="px-3 py-2 rounded-xl text-xs font-medium text-zinc-300 hover:text-amber-300 hover:bg-white/5 transition-all flex items-center gap-1"
                title="भोलिको पञ्चाङ्ग (Tomorrow)"
              >
                <span>भोलि</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* City Selector */}
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-black/50 text-amber-200 text-xs rounded-xl border border-amber-500/30 px-3 py-2.5 focus:outline-none focus:border-amber-400"
            >
              {cities.map((city) => (
                <option key={city} value={city} className="bg-[#141624] text-white">
                  📍 {city}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick jump banner to Rashifal */}
        <div className="relative z-10 mt-6 pt-5 border-t border-amber-500/15 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-zinc-300">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>आजको १२ वटै राशिका विस्तृत दैनिक, साप्ताहिक, मासिक र वार्षिक फल हेर्नुहोस्:</span>
          </div>
          <button
            onClick={onNavigateToRashifal}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/25 transition-all transform hover:scale-[1.02] flex items-center gap-2 cursor-pointer"
          >
            <span>आजको १२ राशि फल हेर्नुहोस्</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 5 Core Pillars of Panchang (पञ्च अङ्ग: तिथि, वार, नक्षत्र, योग, करण) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-amber-200 flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-amber-400" />
            <span>पञ्चाङ्गका मुख्य ५ अङ्गहरू (The 5 Limbs)</span>
          </h3>
          <span className="text-xs text-amber-300/70">तिथि • वार • नक्षत्र • योग • करण</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* 1. Tithi */}
          <div className="bg-[#131522] border border-amber-500/20 hover:border-amber-500/50 transition-colors rounded-2xl p-5 shadow-lg relative overflow-hidden group">
            <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">१. तिथि (Tithi)</div>
            <div className="text-lg font-bold text-amber-100 group-hover:text-amber-300 transition-colors">
              {panchang.tithi}
            </div>
            <div className="text-xs text-zinc-400 mt-1">{panchang.paksha}</div>
            <div className="mt-3 pt-2 border-t border-white/5 text-[11px] text-zinc-500">
              {panchang.tithiEn}
            </div>
          </div>

          {/* 2. Vaar */}
          <div className="bg-[#131522] border border-amber-500/20 hover:border-amber-500/50 transition-colors rounded-2xl p-5 shadow-lg relative overflow-hidden group">
            <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">२. वार (Day / Vaar)</div>
            <div className="text-lg font-bold text-amber-100 group-hover:text-amber-300 transition-colors">
              {panchang.vaar}
            </div>
            <div className="text-xs text-zinc-400 mt-1">स्वामी ग्रह: {panchang.vaar.includes('आइत') ? 'सूर्य' : panchang.vaar.includes('सोम') ? 'चन्द्र' : panchang.vaar.includes('मङ्गल') ? 'मङ्गल' : panchang.vaar.includes('बुध') ? 'बुध' : panchang.vaar.includes('बिही') ? 'बृहस्पति' : panchang.vaar.includes('शुक्र') ? 'शुक्र' : 'शनि'}</div>
            <div className="mt-3 pt-2 border-t border-white/5 text-[11px] text-zinc-500">
              {panchang.vaarEn}
            </div>
          </div>

          {/* 3. Nakshatra */}
          <div className="bg-[#131522] border border-amber-500/20 hover:border-amber-500/50 transition-colors rounded-2xl p-5 shadow-lg relative overflow-hidden group">
            <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">३. नक्षत्र (Nakshatra)</div>
            <div className="text-lg font-bold text-amber-100 group-hover:text-amber-300 transition-colors">
              {panchang.nakshatra}
            </div>
            <div className="text-xs text-zinc-400 mt-1">२७ नक्षत्र अन्तर्गत</div>
            <div className="mt-3 pt-2 border-t border-white/5 text-[11px] text-zinc-500">
              {panchang.nakshatraEn}
            </div>
          </div>

          {/* 4. Yoga */}
          <div className="bg-[#131522] border border-amber-500/20 hover:border-amber-500/50 transition-colors rounded-2xl p-5 shadow-lg relative overflow-hidden group">
            <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">४. योग (Yoga)</div>
            <div className="text-lg font-bold text-amber-100 group-hover:text-amber-300 transition-colors">
              {panchang.yoga}
            </div>
            <div className="text-xs text-zinc-400 mt-1">२७ नित्य योग</div>
            <div className="mt-3 pt-2 border-t border-white/5 text-[11px] text-zinc-500">
              {panchang.yogaEn}
            </div>
          </div>

          {/* 5. Karana */}
          <div className="bg-[#131522] border border-amber-500/20 hover:border-amber-500/50 transition-colors rounded-2xl p-5 shadow-lg relative overflow-hidden group">
            <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">५. करण (Karana)</div>
            <div className="text-lg font-bold text-amber-100 group-hover:text-amber-300 transition-colors">
              {panchang.karana}
            </div>
            <div className="text-xs text-zinc-400 mt-1">११ करण अन्तर्गत</div>
            <div className="mt-3 pt-2 border-t border-white/5 text-[11px] text-zinc-500">
              {panchang.karanaEn}
            </div>
          </div>
        </div>
      </div>

      {/* Planetary Positions & Solar/Lunar Cycles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Sun & Moon Timings */}
        <div className="bg-[#131522] border border-amber-500/20 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h4 className="font-bold text-amber-200 flex items-center gap-2">
              <Sun className="w-5 h-5 text-amber-400" />
              <span>सूर्य र चन्द्रमा समय (Sun & Moon)</span>
            </h4>
            <span className="text-xs text-zinc-400">प्रत्यक्ष घडी</span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-black/30 border border-white/5">
              <div className="flex items-center gap-2.5">
                <Sun className="w-4 h-4 text-orange-400" />
                <span className="text-xs sm:text-sm text-zinc-300">सूर्योदय (Sunrise)</span>
              </div>
              <span className="text-xs sm:text-sm font-bold text-amber-300">{panchang.suryodaya}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-black/30 border border-white/5">
              <div className="flex items-center gap-2.5">
                <Sun className="w-4 h-4 text-amber-600" />
                <span className="text-xs sm:text-sm text-zinc-300">सूर्यास्त (Sunset)</span>
              </div>
              <span className="text-xs sm:text-sm font-bold text-amber-300">{panchang.suryasta}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-black/30 border border-white/5">
              <div className="flex items-center gap-2.5">
                <Moon className="w-4 h-4 text-blue-300" />
                <span className="text-xs sm:text-sm text-zinc-300">चन्द्रोदय (Moonrise)</span>
              </div>
              <span className="text-xs sm:text-sm font-bold text-blue-200">{panchang.chandrodaya}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-black/30 border border-white/5">
              <div className="flex items-center gap-2.5">
                <Moon className="w-4 h-4 text-indigo-400" />
                <span className="text-xs sm:text-sm text-zinc-300">चन्द्रास्त (Moonset)</span>
              </div>
              <span className="text-xs sm:text-sm font-bold text-blue-200">{panchang.chandrasta}</span>
            </div>
          </div>
        </div>

        {/* Current Rasi of Sun and Moon */}
        <div className="bg-[#131522] border border-amber-500/20 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h4 className="font-bold text-amber-200 flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-400" />
              <span>गोचर राशि (Current Transit)</span>
            </h4>
            <span className="text-xs text-zinc-400">प्रत्यक्ष स्थिति</span>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/20">
              <div className="text-xs text-amber-400 font-semibold mb-1">चन्द्र राशि (Moon Sign)</div>
              <div className="text-base font-bold text-white">{panchang.chandraRasi}</div>
              <div className="text-xs text-zinc-400 mt-0.5">{panchang.chandraRasiEn}</div>
            </div>

            <div className="p-3.5 rounded-xl bg-gradient-to-r from-orange-500/10 to-transparent border border-orange-500/20">
              <div className="text-xs text-orange-400 font-semibold mb-1">सूर्य राशि (Sun Sign)</div>
              <div className="text-base font-bold text-white">{panchang.suryaRasi}</div>
              <div className="text-xs text-zinc-400 mt-0.5">{panchang.suryaRasiEn}</div>
            </div>

            <div className="p-3 rounded-xl bg-black/30 border border-white/5 flex items-center justify-between">
              <span className="text-xs text-zinc-300">अयन (Aayan)</span>
              <span className="text-xs font-semibold text-amber-300">{panchang.aayan}</span>
            </div>

            <div className="p-3 rounded-xl bg-black/30 border border-white/5 flex items-center justify-between">
              <span className="text-xs text-zinc-300">पञ्चक विचार</span>
              <span className="text-xs font-semibold text-emerald-400">{panchang.panchakStatus}</span>
            </div>
          </div>
        </div>

        {/* Shubh & Ashubh Muhurat (Rahu Kaal & Abhijit) */}
        <div className="bg-[#131522] border border-amber-500/20 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h4 className="font-bold text-amber-200 flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-400" />
              <span>शुभ र अशुभ समय (Muhurat)</span>
            </h4>
            <span className="text-xs text-zinc-400">समय चक्र</span>
          </div>

          <div className="space-y-3">
            {/* Abhijit Muhurat (Auspicious) */}
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30">
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold mb-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>अभिजित मुहूर्त (अति शुभ)</span>
              </div>
              <div className="text-xs sm:text-sm font-semibold text-emerald-100">
                {panchang.abhijitMuhurat}
              </div>
            </div>

            {/* Rahu Kaal (Inauspicious) */}
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30">
              <div className="flex items-center gap-1.5 text-xs text-rose-400 font-bold mb-1">
                <AlertTriangle className="w-4 h-4" />
                <span>राहुकाल (शुभ कार्य वर्जित)</span>
              </div>
              <div className="text-xs sm:text-sm font-semibold text-rose-100">
                {panchang.rahuKaal}
              </div>
            </div>

            {/* Yamaghanta & Gulika */}
            <div className="p-2.5 rounded-xl bg-black/30 border border-white/5 text-xs flex justify-between">
              <span className="text-zinc-400">यमघण्ट काल:</span>
              <span className="text-zinc-200 font-medium">{panchang.yamaGhanta}</span>
            </div>

            <div className="p-2.5 rounded-xl bg-black/30 border border-white/5 text-xs flex justify-between">
              <span className="text-zinc-400">गुलिक काल:</span>
              <span className="text-zinc-200 font-medium">{panchang.gulikaKaal}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Disha Shool & Daily Festival Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Disha Shool with Remedy */}
        <div className="bg-gradient-to-br from-[#1a1728] to-[#121420] border border-amber-500/20 rounded-3xl p-6 shadow-xl space-y-3">
          <div className="flex items-center gap-2 text-amber-300 font-bold text-base">
            <Compass className="w-5 h-5 text-amber-400" />
            <span>आजको दिशा शूल र निवारण उपाय (Disha Shool & Remedy)</span>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-amber-500/15 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-300">दिशा शूल (यात्रा गर्न नहुने दिशा):</span>
              <span className="font-bold text-rose-400">{panchang.dishaShool}</span>
            </div>
            <div className="text-xs text-amber-200/90 pt-2 border-t border-white/5">
              <span className="font-semibold text-amber-300">यात्रा गर्नै परेको उपाय: </span>
              {panchang.dishaShoolRemedy}
            </div>
          </div>
        </div>

        {/* Parva & Festival of the Day */}
        <div className="bg-gradient-to-br from-[#1a1728] to-[#121420] border border-amber-500/20 rounded-3xl p-6 shadow-xl space-y-3">
          <div className="flex items-center gap-2 text-amber-300 font-bold text-base">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <span>पर्व, उत्सव तथा धार्मिक महत्त्व (Festivals & Rituals)</span>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-amber-500/15 space-y-2">
            <div className="text-sm font-semibold text-amber-100">
              {panchang.festival}
            </div>
            <p className="text-xs text-zinc-400">
              आजको दिन नित्य सन्ध्या, गायत्री जप तथा पितृ स्मरण गर्दा विशेष आत्मिक बल र शान्ति मिल्नेछ।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
