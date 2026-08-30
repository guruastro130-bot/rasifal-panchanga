import React from 'react';
import { Calendar, Sparkles, Compass, Clock, Volume2, Share2 } from 'lucide-react';
import { playTempleBell } from '../utils/audio';

export type MainTab = 'panchang' | 'rashifal' | 'ai_astrologer' | 'muhurat' | 'social_autopost';

interface NavbarProps {
  activeTab: MainTab;
  setActiveTab: (tab: MainTab) => void;
  bsDateText?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  bsDateText = '२०८३ भाद्र १४, आइतबार'
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#11131f]/95 backdrop-blur-md border-b border-amber-500/20 shadow-xl shadow-black/40">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-950/60 via-amber-900/40 to-amber-950/60 border-b border-amber-500/10 px-4 py-1.5 text-xs text-amber-200/90">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="font-medium text-amber-300">पञ्चाङ्ग मिति:</span>
            <span>{bsDateText}</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => playTempleBell()}
              title="मन्दिरको घण्टी बजाउनुहोस् (Play Temple Bell)"
              className="flex items-center gap-1 hover:text-amber-300 transition-colors cursor-pointer px-2.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20"
            >
              <Volume2 className="w-3.5 h-3.5 text-amber-400" />
              <span>घण्टी / ॐ</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Header & Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-18">
          {/* Logo & Branding */}
          <div 
            onClick={() => setActiveTab('panchang')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-red-700 flex items-center justify-center shadow-lg shadow-amber-600/25 border border-amber-300/30 group-hover:scale-105 transition-transform">
              <span className="text-2xl font-serif text-amber-100 drop-shadow">ॐ</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-amber-200 via-amber-400 to-orange-300 bg-clip-text text-transparent tracking-tight">
                  दैनिक राशिफल र पञ्चाङ्ग
                </h1>
              </div>
              <p className="text-xs text-amber-200/60 hidden sm:block">
                १२ वटै राशिका नामाक्षर सहित दैनिक, साप्ताहिक, मासिक र वार्षिक राशिफल
              </p>
            </div>
          </div>

          {/* Navigation Items (First is Panchang as mandated) */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {/* 1. Panchang (First Menu Item) */}
            <button
              onClick={() => setActiveTab('panchang')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                activeTab === 'panchang'
                  ? 'bg-gradient-to-r from-amber-500/25 to-amber-600/30 text-amber-300 border border-amber-500/40 shadow-inner'
                  : 'text-zinc-300 hover:text-amber-200 hover:bg-white/5'
              }`}
            >
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>१. पञ्चाङ्ग</span>
            </button>

            {/* 2. Rashifal */}
            <button
              onClick={() => setActiveTab('rashifal')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                activeTab === 'rashifal'
                  ? 'bg-gradient-to-r from-amber-500/25 to-amber-600/30 text-amber-300 border border-amber-500/40 shadow-inner'
                  : 'text-zinc-300 hover:text-amber-200 hover:bg-white/5'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>२. १२ राशि फल</span>
            </button>

            {/* 3. Live AI Astrologer */}
            <button
              onClick={() => setActiveTab('ai_astrologer')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                activeTab === 'ai_astrologer'
                  ? 'bg-gradient-to-r from-amber-500/25 to-amber-600/30 text-amber-300 border border-amber-500/40 shadow-inner'
                  : 'text-zinc-300 hover:text-amber-200 hover:bg-white/5'
              }`}
            >
              <Compass className="w-4 h-4 text-amber-400" />
              <span>३. प्रत्यक्ष ज्योतिषी</span>
            </button>

            {/* 4. Muhurat */}
            <button
              onClick={() => setActiveTab('muhurat')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                activeTab === 'muhurat'
                  ? 'bg-gradient-to-r from-amber-500/25 to-amber-600/30 text-amber-300 border border-amber-500/40 shadow-inner'
                  : 'text-zinc-300 hover:text-amber-200 hover:bg-white/5'
              }`}
            >
              <Clock className="w-4 h-4 text-amber-400" />
              <span>४. शुभ मुहूर्त</span>
            </button>

            {/* 5. Automated Social Media Poster */}
            <button
              onClick={() => setActiveTab('social_autopost')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                activeTab === 'social_autopost'
                  ? 'bg-gradient-to-r from-amber-500/25 to-amber-600/30 text-amber-300 border border-amber-500/40 shadow-inner'
                  : 'text-zinc-300 hover:text-amber-200 hover:bg-white/5'
              }`}
            >
              <Share2 className="w-4 h-4 text-amber-400" />
              <span>५. स्वचालित पोस्ट</span>
            </button>
          </nav>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="lg:hidden flex items-center gap-1 py-2 overflow-x-auto no-scrollbar border-t border-white/5">
          <button
            onClick={() => setActiveTab('panchang')}
            className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'panchang'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span>पञ्चाङ्ग</span>
          </button>
          <button
            onClick={() => setActiveTab('rashifal')}
            className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'rashifal'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>१२ राशि फल</span>
          </button>
          <button
            onClick={() => setActiveTab('ai_astrologer')}
            className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'ai_astrologer'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>ज्योतिषी</span>
          </button>
          <button
            onClick={() => setActiveTab('muhurat')}
            className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'muhurat'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>शुभ मुहूर्त</span>
          </button>
          <button
            onClick={() => setActiveTab('social_autopost')}
            className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'social_autopost'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Share2 className="w-3.5 h-3.5 text-amber-400" />
            <span>स्वचालित पोस्ट</span>
          </button>
        </div>
      </div>
    </header>
  );
};
