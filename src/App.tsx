import React, { useState, useEffect, useMemo } from 'react';
import { Navbar, MainTab } from './components/Navbar';
import { PanchangView } from './components/PanchangView';
import { RashifalView } from './components/RashifalView';
import { AIAstrologerModal } from './components/AIAstrologerModal';
import { MuhuratView } from './components/MuhuratView';
import { getDynamicRasis } from './data/horoscopeEngine';
import { getTodayPanchang } from './data/panchangData';
import { RasiInfo, HoroscopePeriod, PanchangInfo } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<MainTab>('panchang');
  const [dateOffset, setDateOffset] = useState<number>(0);
  
  // Calculate target date based on offset
  const targetDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + dateOffset);
    return d;
  }, [dateOffset]);

  const [panchang, setPanchang] = useState<PanchangInfo>(() => getTodayPanchang(0));
  const [rasis, setRasis] = useState<RasiInfo[]>(() => getDynamicRasis(new Date()).rasis);
  const [period, setPeriod] = useState<HoroscopePeriod>('daily');

  // Automatically update panchang & dynamic rasis whenever date changes
  useEffect(() => {
    setPanchang(getTodayPanchang(dateOffset));
    const dynamicData = getDynamicRasis(targetDate);
    setRasis(dynamicData.rasis);
  }, [dateOffset, targetDate]);

  // Consult AI Astrologer handler
  const handleConsultAI = async (
    rasiId: string, 
    p: HoroscopePeriod, 
    question: string,
    birthDetails?: { birthDate: string; birthTime: string; birthPlace: string }
  ) => {
    const response = await fetch('/api/gemini/live-prediction', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        rasiId,
        period: p,
        customQuestion: question,
        ...birthDetails
      })
    });
    const data = await response.json();
    return data;
  };

  return (
    <div className="min-h-screen bg-[#0b0c14] text-[#f4efe6] flex flex-col selection:bg-amber-500/30 selection:text-amber-200">
      {/* Navbar Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        bsDateText={panchang.bsDate}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* 1. Panchang View (First Menu) */}
        {activeTab === 'panchang' && (
          <PanchangView
            panchang={panchang}
            dateOffset={dateOffset}
            onDateOffsetChange={setDateOffset}
            onNavigateToRashifal={() => {
              setActiveTab('rashifal');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* 2. Rashifal View */}
        {activeTab === 'rashifal' && (
          <RashifalView
            rasis={rasis}
            period={period}
            onPeriodChange={setPeriod}
            targetDate={targetDate}
          />
        )}

        {/* 3. Live AI Astrologer */}
        {activeTab === 'ai_astrologer' && (
          <AIAstrologerModal
            rasis={rasis}
            onConsultAI={handleConsultAI}
          />
        )}

        {/* 4. Muhurat & Choghadiya */}
        {activeTab === 'muhurat' && (
          <MuhuratView />
        )}
      </main>

      {/* Sacred Footer */}
      <footer className="bg-[#0e0f18] border-t border-amber-500/20 py-8 px-4 text-center text-xs text-amber-200/60 mt-12">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex items-center justify-center gap-2 text-base font-serif font-bold text-amber-300">
            <span>ॐ सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः</span>
          </div>
          <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-zinc-500">
            <div>
              &copy; {new Date().getFullYear()} दैनिक राशिफल र पञ्चाङ्ग (Daily Rashifal & Panchang). All rights reserved.
            </div>
            <div className="flex items-center gap-4">
              <span className="text-amber-400">विक्रम संवत् {panchang.bsDate.split(' ')[0] || '२०८३'}</span>
              <span>•</span>
              <span className="text-zinc-400">सनातन वैदिक ज्योतिष तथा पञ्चाङ्ग</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
