import React from 'react';
import { Clock, CheckCircle2, AlertTriangle, Sparkles, Shield, Sun, Moon } from 'lucide-react';
import { playTempleBell } from '../utils/audio';

export const MuhuratView: React.FC = () => {
  const choghadiyasDay = [
    { name: 'उद्वेग (Udveg)', status: 'अशुभ', planet: 'सूर्य', time: '०५:४३ AM - ०७:१५ AM', color: 'rose' },
    { name: 'चल (Char)', status: 'सामान्य', planet: 'शुक्र', time: '०७:१५ AM - ०८:४८ AM', color: 'blue' },
    { name: 'लाभ (Laabh)', status: 'अति शुभ', planet: 'बुध', time: '०८:४८ AM - १०:२० AM', color: 'emerald' },
    { name: 'अमृत (Amrit)', status: 'सर्वोत्तम शुभ', planet: 'चन्द्र', time: '१०:२० AM - ११:५३ AM', color: 'emerald' },
    { name: 'काल (Kaal)', status: 'अशुभ', planet: 'शनि', time: '११:५३ AM - ०१:२५ PM', color: 'rose' },
    { name: 'शुभ (Shubh)', status: 'अति शुभ', planet: 'गुरु', time: '०१:२५ PM - ०२:५८ PM', color: 'emerald' },
    { name: 'रोग (Rog)', status: 'अशुभ', planet: 'मङ्गल', time: '०२:५८ PM - ०४:३० PM', color: 'rose' },
    { name: 'उद्वेग (Udveg)', status: 'अशुभ', planet: 'सूर्य', time: '०४:३० PM - ०६:०२ PM', color: 'rose' }
  ];

  const auspiciousActivities = [
    { activity: 'नयाँ व्यापार तथा पसल उद्घाटन', muhurat: 'लाभ र अमृत चोघडिया (१०:२० AM - ११:५३ AM)', suitability: 'उत्तम' },
    { activity: 'सवारी साधन / वाहन खरिद', muhurat: 'अभिजित मुहूर्त (११:४२ AM - १२:३४ PM)', suitability: 'उत्कृष्ट' },
    { activity: 'गृहप्रवेश तथा नयाँ घर बसाइँसराइ', muhurat: 'शुभ चोघडिया तथा अमृत काल', suitability: 'शुभ' },
    { activity: 'विवाह, व्रतबन्ध तथा टीकाटालो', muhurat: 'गुरु पुष्य / सर्वार्थ सिद्धि योग', suitability: 'सर्वोत्तम' },
    { activity: 'बैंक खाता खोल्ने वा शेयर लगानी', muhurat: 'बुधको लाभ समय (०८:४८ AM - १०:२० AM)', suitability: 'लाभदायक' }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-[#1a172c] via-[#141624] to-[#1a121c] border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold mb-3 border border-amber-500/30">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>दैनिक शुभ मुहूर्त तथा चोघडिया चक्र (Auspicious Timings & Choghadiya)</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-amber-100 tracking-tight">
            आजको शुभ कार्य मुहूर्त र चोघडिया
          </h2>
          <p className="text-zinc-300 text-sm sm:text-base mt-2">
            कुनै पनि नयाँ कार्य, व्यापार, यात्रा, वा आर्थिक कारोबार सुरु गर्नु अगाडि शुभ मुहूर्त र चोघडियाको विचार गर्नुहोस्।
          </p>
        </div>
      </div>

      {/* Choghadiya Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-amber-200 flex items-center gap-2">
            <Sun className="w-5 h-5 text-amber-400" />
            <span>दिनको चोघडिया (Daytime Choghadiya)</span>
          </h3>
          <span className="text-xs text-zinc-400">सूर्योदय देखि सूर्यास्तसम्म</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {choghadiyasDay.map((ch, idx) => {
            const isGood = ch.color === 'emerald';
            return (
              <div
                key={idx}
                className={`p-4 rounded-2xl border transition-all ${
                  isGood
                    ? 'bg-emerald-950/25 border-emerald-500/40 shadow-lg shadow-emerald-950/50'
                    : ch.color === 'blue'
                    ? 'bg-[#141626] border-blue-500/30'
                    : 'bg-rose-950/20 border-rose-500/30'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-white">{ch.name}</span>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      isGood
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : ch.color === 'blue'
                        ? 'bg-blue-500/20 text-blue-300'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}
                  >
                    {ch.status}
                  </span>
                </div>
                <div className="text-xs text-amber-300 font-semibold font-sans">{ch.time}</div>
                <div className="text-[11px] text-zinc-400 mt-1">स्वामी: {ch.planet}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Auspicious Activity Guidance */}
      <div className="bg-[#131522] border border-amber-500/20 rounded-3xl p-6 shadow-xl space-y-4">
        <h3 className="text-lg font-bold text-amber-200 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span>कार्य अनुसारको उत्तम मुहूर्त (Activity-based Auspicious Timings)</span>
        </h3>

        <div className="space-y-3">
          {auspiciousActivities.map((act, i) => (
            <div
              key={i}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 rounded-2xl bg-black/40 border border-white/5 gap-3"
            >
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <div className="text-sm font-bold text-white">{act.activity}</div>
                  <div className="text-xs text-amber-300/90 mt-0.5">{act.muhurat}</div>
                </div>
              </div>
              <span className="px-3 py-1 rounded-xl bg-emerald-500/15 text-emerald-300 text-xs font-bold border border-emerald-500/30 shrink-0">
                {act.suitability}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
