import React, { useState, useEffect, useRef } from 'react';
import { 
  Share2, Download, Copy, Check, Sparkles, 
  Settings, Clock, Send, RefreshCw, CheckCircle2,
  AlertCircle, ExternalLink, Image as ImageIcon,
  Video, Youtube, MessageCircle, FileText
} from 'lucide-react';
import { PanchangInfo, RasiInfo, SocialPlatform, SocialPostDraft, SocialAutoPostSettings, SocialBroadcastLog } from '../types';
import { generateSocialMediaPosts, drawSocialCardToCanvas, CardAspectRatio } from '../utils/socialMediaEngine';
import { playTempleBell, playOmChime } from '../utils/audio';

interface SocialAutoPostViewProps {
  panchang: PanchangInfo;
  rasis: RasiInfo[];
}

export const SocialAutoPostView: React.FC<SocialAutoPostViewProps> = ({
  panchang,
  rasis
}) => {
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform>('facebook');
  const [activeSubTab, setActiveSubTab] = useState<'content' | 'images' | 'automation' | 'logs'>('content');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isBroadcasting, setIsBroadcasting] = useState<boolean>(false);
  const [broadcastMessage, setBroadcastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // AI re-write state
  const [aiTone, setAiTone] = useState<string>('भक्तिमय र प्रेरणादायी');
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);
  const [customGeneratedDrafts, setCustomGeneratedDrafts] = useState<Record<string, string>>({});

  // Canvas Image Generator States
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [aspectRatio, setAspectRatio] = useState<CardAspectRatio>('square');
  const [selectedRasiForImage, setSelectedRasiForImage] = useState<string>('all'); // 'all' or rasiId

  // Automation Settings & Logs from backend
  const [settings, setSettings] = useState<SocialAutoPostSettings>({
    enabled: true,
    morningTime: '06:00',
    webhookUrl: '',
    metaAccessToken: '',
    autoGenerateImage: true,
    enabledPlatforms: {
      facebook: true,
      instagram: true,
      tiktok: true,
      youtube: true,
    },
    lastBroadcastTime: new Date().toISOString(),
    lastBroadcastStatus: 'सक्रिय (Active)'
  });
  const [logs, setLogs] = useState<SocialBroadcastLog[]>([]);
  const [isSavingSettings, setIsSavingSettings] = useState<boolean>(false);

  // Generate today's base posts
  const defaultDrafts: Record<SocialPlatform, SocialPostDraft> = generateSocialMediaPosts(panchang, rasis);
  const activeDraft: SocialPostDraft = defaultDrafts[selectedPlatform];
  const activeContent = customGeneratedDrafts[selectedPlatform] || activeDraft.content;

  // Fetch settings & logs on mount
  useEffect(() => {
    fetch('/api/social/settings')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          if (data.config) setSettings(data.config);
          if (data.logs) setLogs(data.logs);
        }
      })
      .catch(err => console.warn('Error fetching social settings:', err));
  }, []);

  // Redraw canvas whenever options change
  useEffect(() => {
    if (canvasRef.current) {
      const targetRasi = selectedRasiForImage === 'all' 
        ? undefined 
        : rasis.find(r => r.id === selectedRasiForImage);

      drawSocialCardToCanvas(canvasRef.current, {
        panchang,
        rasi: targetRasi,
        rasis,
        aspectRatio,
        brandName: 'दैनिक राशिफल र पञ्चाङ्ग'
      });
    }
  }, [panchang, rasis, aspectRatio, selectedRasiForImage, activeSubTab]);

  // Handle Copy to Clipboard
  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    playOmChime();
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // Handle Instant Broadcast Trigger
  const handleTriggerBroadcast = async () => {
    setIsBroadcasting(true);
    setBroadcastMessage(null);
    playTempleBell();

    try {
      const res = await fetch('/api/social/trigger-broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (data.success) {
        setBroadcastMessage({
          type: 'success',
          text: 'सफलतापूर्वक प्रसारण भयो! फेसबुक, इन्स्टाग्राम, टिकटक र युट्युबका लागि दैनिक सामग्री र इमेज तयार भएको छ।'
        });
        if (data.log) {
          setLogs(prev => [data.log, ...prev]);
        }
      } else {
        setBroadcastMessage({
          type: 'error',
          text: data.error || 'प्रसारण गर्दा त्रुटि देखा पर्‍यो।'
        });
      }
    } catch (err: any) {
      setBroadcastMessage({
        type: 'error',
        text: 'सर्भर सम्पर्क असफल: ' + err.message
      });
    } finally {
      setIsBroadcasting(false);
    }
  };

  // Handle AI Content Generation
  const handleGenerateAiText = async () => {
    setIsGeneratingAi(true);
    try {
      const res = await fetch('/api/social/generate-ai-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform: selectedPlatform,
          customTone: aiTone
        })
      });
      const data = await res.json();
      if (data.success && data.generatedContent) {
        setCustomGeneratedDrafts(prev => ({
          ...prev,
          [selectedPlatform]: data.generatedContent
        }));
        playOmChime();
      }
    } catch (e) {
      console.warn('AI social script error:', e);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Handle Image Download
  const handleDownloadImage = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    const rasiName = selectedRasiForImage === 'all' ? 'All-12-Rasis' : selectedRasiForImage;
    link.download = `Rashifal-Panchang-${panchang.bsDate.replace(/\s+/g, '-')}-${rasiName}-${aspectRatio}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
    playOmChime();
  };

  // Handle Save Settings
  const handleSaveSettings = async () => {
    setIsSavingSettings(true);
    try {
      const res = await fetch('/api/social/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      const data = await res.json();
      if (data.success) {
        playTempleBell();
        alert('सेटिङ सफलतापूर्वक सुरक्षित गरियो!');
      }
    } catch (e: any) {
      alert('सेटिङ सुरक्षित गर्न सकिएन: ' + e.message);
    } finally {
      setIsSavingSettings(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner & Header */}
      <div className="relative bg-gradient-to-r from-[#1f162b] via-[#141624] to-[#1d121c] border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-semibold flex items-center gap-1.5 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>दैनिक बिहान {settings.morningTime} बजे स्वचालित पोस्टिङ सक्रिय</span>
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-amber-100 flex items-center gap-3">
              <Share2 className="w-7 h-7 text-amber-400" />
              <span>स्वचालित सामाजिक सञ्जाल प्रसारण</span>
            </h2>

            <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl leading-relaxed">
              फेसबुक, इन्स्टाग्राम, टिकटक र युट्युबका लागि दैनिक बिहान स्वतः उच्च गुणस्तरको राशिफल पोस्ट, एचडी इमेज कार्ड र भिडियो स्क्रिप्ट तयार हुन्छ।
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleTriggerBroadcast}
              disabled={isBroadcasting}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm shadow-xl shadow-amber-500/30 flex items-center gap-2 cursor-pointer transition-all active:scale-95 disabled:opacity-50"
            >
              {isBroadcasting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>प्रसारण हुँदैछ...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>अहिले तुरुन्तै प्रसारण गर्नुहोस्</span>
                </>
              )}
            </button>
          </div>
        </div>

        {broadcastMessage && (
          <div className={`mt-4 p-4 rounded-2xl border flex items-center gap-3 text-xs sm:text-sm ${
            broadcastMessage.type === 'success' 
              ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-200' 
              : 'bg-rose-950/50 border-rose-500/40 text-rose-200'
          }`}>
            {broadcastMessage.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            )}
            <span>{broadcastMessage.text}</span>
          </div>
        )}
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="bg-[#141624] border border-amber-500/20 p-2 rounded-2xl flex items-center gap-2 overflow-x-auto no-scrollbar shadow-lg">
        <button
          onClick={() => setActiveSubTab('content')}
          className={`flex items-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'content'
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-zinc-300 hover:text-amber-200 hover:bg-white/5'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>१. प्लेटफर्म पोस्ट ड्राफ्ट</span>
        </button>

        <button
          onClick={() => setActiveSubTab('images')}
          className={`flex items-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'images'
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-zinc-300 hover:text-amber-200 hover:bg-white/5'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>२. एचडी इमेज कार्ड जेनेरेटर</span>
        </button>

        <button
          onClick={() => setActiveSubTab('automation')}
          className={`flex items-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'automation'
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-zinc-300 hover:text-amber-200 hover:bg-white/5'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>३. बिहानी तालिका र Webhook सेटिङ</span>
        </button>

        <button
          onClick={() => setActiveSubTab('logs')}
          className={`flex items-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'logs'
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-zinc-300 hover:text-amber-200 hover:bg-white/5'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>४. प्रसारण इतिहास र लगहरू</span>
        </button>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          TAB 1: SOCIAL PLATFORMS CONTENT DRAFTS
      ───────────────────────────────────────────────────────────── */}
      {activeSubTab === 'content' && (
        <div className="space-y-6">
          {/* Platform Selector Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Facebook */}
            <button
              onClick={() => setSelectedPlatform('facebook')}
              className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                selectedPlatform === 'facebook'
                  ? 'bg-[#18233c] border-blue-400 shadow-lg shadow-blue-500/20 text-white'
                  : 'bg-[#121420] border-amber-500/20 text-zinc-400 hover:text-zinc-200 hover:bg-[#161828]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow">
                  f
                </div>
                <div>
                  <div className="text-sm font-bold">फेसबुक</div>
                  <div className="text-[11px] opacity-70">लामो पोस्ट + ह्यासट्याग</div>
                </div>
              </div>
              {selectedPlatform === 'facebook' && <div className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse"></div>}
            </button>

            {/* Instagram */}
            <button
              onClick={() => setSelectedPlatform('instagram')}
              className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                selectedPlatform === 'instagram'
                  ? 'bg-[#2b1627] border-pink-400 shadow-lg shadow-pink-500/20 text-white'
                  : 'bg-[#121420] border-amber-500/20 text-zinc-400 hover:text-zinc-200 hover:bg-[#161828]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-600 to-purple-600 text-white flex items-center justify-center font-bold shadow">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold">इन्स्टाग्राम</div>
                  <div className="text-[11px] opacity-70">क्याप्सन + भाइरल ट्याग</div>
                </div>
              </div>
              {selectedPlatform === 'instagram' && <div className="w-2.5 h-2.5 rounded-full bg-pink-400 animate-pulse"></div>}
            </button>

            {/* TikTok */}
            <button
              onClick={() => setSelectedPlatform('tiktok')}
              className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                selectedPlatform === 'tiktok'
                  ? 'bg-[#122329] border-cyan-400 shadow-lg shadow-cyan-500/20 text-white'
                  : 'bg-[#121420] border-amber-500/20 text-zinc-400 hover:text-zinc-200 hover:bg-[#161828]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-cyan-500 to-rose-500 text-white flex items-center justify-center font-bold shadow">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold">टिकटक</div>
                  <div className="text-[11px] opacity-70">६० से. भ्वाइस स्क्रिप्ट</div>
                </div>
              </div>
              {selectedPlatform === 'tiktok' && <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></div>}
            </button>

            {/* YouTube */}
            <button
              onClick={() => setSelectedPlatform('youtube')}
              className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                selectedPlatform === 'youtube'
                  ? 'bg-[#2b1414] border-red-500 shadow-lg shadow-red-500/20 text-white'
                  : 'bg-[#121420] border-amber-500/20 text-zinc-400 hover:text-zinc-200 hover:bg-[#161828]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold shadow">
                  <Youtube className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold">युट्युब</div>
                  <div className="text-[11px] opacity-70">शीर्षक, विवरण र टाइमस्ट्याम्प</div>
                </div>
              </div>
              {selectedPlatform === 'youtube' && <div className="w-2.5 h-2.5 rounded-full bg-red-400 animate-pulse"></div>}
            </button>
          </div>

          {/* AI Re-write & Viral Tone Bar */}
          <div className="bg-[#121420] border border-amber-500/20 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-xs sm:text-sm font-bold text-amber-200">AI शैली रूपान्तरण:</span>
              <select
                value={aiTone}
                onChange={e => setAiTone(e.target.value)}
                className="bg-black/60 border border-amber-500/30 text-amber-100 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-amber-400"
              >
                <option value="भक्तिमय र प्रेरणादायी">भक्तिमय तथा धार्मिक (Devotional)</option>
                <option value="युवा तथा आकर्षक">आधुनिक तथा भाइरल (Youth & Trendy)</option>
                <option value="छोटो र बुँदागत">छोटो र बुँदागत (Concise & Direct)</option>
                <option value="विशेष पर्व र व्रत सन्देश">पर्व तथा चाडपर्व विशेष (Festive)</option>
              </select>
            </div>

            <button
              onClick={handleGenerateAiText}
              disabled={isGeneratingAi}
              className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isGeneratingAi ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>AI द्वारा लेखिँदैछ...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>नयाँ शैलीमा जेनेरेट गर्नुहोस्</span>
                </>
              )}
            </button>
          </div>

          {/* Main Draft Display Box */}
          <div className="bg-[#141624] border border-amber-500/30 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-amber-500/20">
              <div>
                <h3 className="text-lg font-bold text-amber-200 flex items-center gap-2">
                  <span>{activeDraft.title}</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  {selectedPlatform === 'tiktok' ? '६० सेकेन्डको भिडियो बोल्ने स्क्रिप्ट' : 'तयार गरिएको टेक्स्ट क्याप्सन'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(activeContent, selectedPlatform)}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all shadow-md"
                >
                  {copiedKey === selectedPlatform ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-950" />
                      <span>कपी भयो ✓</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>सम्पूर्ण टेक्स्ट कपी गर्नुहोस्</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* TikTok Video Script Box (if TikTok selected) */}
            {selectedPlatform === 'tiktok' && activeDraft.shortScript && (
              <div className="bg-cyan-950/30 border border-cyan-500/30 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                    <Video className="w-4 h-4" />
                    <span>रेडियो / भिडियो वाचन स्क्रिप्ट (Voiceover Script):</span>
                  </div>
                  <button
                    onClick={() => handleCopy(activeDraft.shortScript!, 'tiktok-script')}
                    className="text-xs text-cyan-300 underline cursor-pointer hover:text-cyan-100"
                  >
                    {copiedKey === 'tiktok-script' ? 'कपी भयो ✓' : 'स्क्रिप्ट मात्र कपी'}
                  </button>
                </div>
                <pre className="text-xs sm:text-sm text-cyan-100 font-sans whitespace-pre-wrap leading-relaxed">
                  {activeDraft.shortScript}
                </pre>
                {activeDraft.suggestedMusic && (
                  <div className="pt-2 border-t border-cyan-500/20 text-xs text-cyan-300/80">
                    🎵 <strong>सिफारिस गरिएको ब्याकग्राउन्ड म्युजिक:</strong> {activeDraft.suggestedMusic}
                  </div>
                )}
              </div>
            )}

            {/* Textarea Content */}
            <div className="relative">
              <textarea
                readOnly
                value={activeContent}
                rows={14}
                className="w-full bg-black/40 border border-amber-500/20 rounded-2xl p-4 text-xs sm:text-sm text-zinc-200 font-sans leading-relaxed focus:outline-none resize-none"
              />
            </div>

            {/* Quick Share Links */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-400">द्रुत सेयरिङ:</span>
                {/* WhatsApp Share */}
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(activeContent.slice(0, 800) + '...')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/40 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center gap-1"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>ह्वाट्सएप (WhatsApp)</span>
                </a>

                {/* Facebook Web Share */}
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/30 text-blue-300 text-xs font-medium flex items-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>फेसबुक खोल्नुहोस्</span>
                </a>
              </div>

              <div className="text-[11px] text-zinc-400">
                कुल अक्षरहरू: {activeContent.length}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 2: HD IMAGE & GRAPHICAL CARD GENERATOR
      ───────────────────────────────────────────────────────────── */}
      {activeSubTab === 'images' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="bg-[#121420] border border-amber-500/20 p-5 rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* 1. Aspect Ratio */}
            <div>
              <label className="block text-xs font-bold text-amber-300 mb-1.5">
                इमेज साइज / आकार (Aspect Ratio):
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => setAspectRatio('square')}
                  className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    aspectRatio === 'square'
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow'
                      : 'bg-black/40 text-zinc-300 border-white/10 hover:border-amber-500/40'
                  }`}
                >
                  १:१ वर्गाकार (Feed)
                </button>
                <button
                  onClick={() => setAspectRatio('vertical')}
                  className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    aspectRatio === 'vertical'
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow'
                      : 'bg-black/40 text-zinc-300 border-white/10 hover:border-amber-500/40'
                  }`}
                >
                  ९:१६ स्टोरी (Story/Reel)
                </button>
                <button
                  onClick={() => setAspectRatio('landscape')}
                  className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    aspectRatio === 'landscape'
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow'
                      : 'bg-black/40 text-zinc-300 border-white/10 hover:border-amber-500/40'
                  }`}
                >
                  १६:९ तेर्सो (Banner)
                </button>
              </div>
            </div>

            {/* 2. Content Type / Rasi Selector */}
            <div>
              <label className="block text-xs font-bold text-amber-300 mb-1.5">
                कार्डको प्रकार वा राशि:
              </label>
              <select
                value={selectedRasiForImage}
                onChange={e => setSelectedRasiForImage(e.target.value)}
                className="w-full bg-black/60 border border-amber-500/30 text-amber-100 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-amber-400"
              >
                <option value="all">🌟 सम्पूर्ण १२ राशिको मास्टर कार्ड (Overview)</option>
                {rasis.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.symbolEmoji} {r.nepaliName} ({r.englishName}) - व्यक्तिगत कार्ड
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Action Buttons */}
            <div className="flex items-end gap-2">
              <button
                onClick={handleDownloadImage}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
              >
                <Download className="w-4 h-4" />
                <span>HD इमेज डाउनलोड (PNG)</span>
              </button>
            </div>
          </div>

          {/* Live Canvas Preview */}
          <div className="bg-[#141624] border border-amber-500/30 rounded-3xl p-6 flex flex-col items-center justify-center shadow-2xl">
            <div className="flex items-center justify-between w-full mb-4 pb-3 border-b border-white/5 text-xs text-zinc-400">
              <div className="flex items-center gap-2 font-bold text-amber-300">
                <ImageIcon className="w-4 h-4" />
                <span>लाइभ कार्ड प्रिभ्यु (Live HD Card Render)</span>
              </div>
              <button
                onClick={handleDownloadImage}
                className="text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>डाउनलोड</span>
              </button>
            </div>

            <div className="max-w-full overflow-auto flex items-center justify-center p-2 bg-black/50 rounded-2xl border border-white/5">
              <canvas
                ref={canvasRef}
                className="rounded-xl shadow-2xl max-h-[600px] w-auto object-contain border border-amber-500/20"
              />
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 3: AUTOMATION & WEBHOOK SETTINGS
      ───────────────────────────────────────────────────────────── */}
      {activeSubTab === 'automation' && (
        <div className="space-y-6">
          <div className="bg-[#141624] border border-amber-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="pb-4 border-b border-amber-500/20">
              <h3 className="text-lg sm:text-xl font-bold text-amber-200 flex items-center gap-2">
                <Settings className="w-5 h-5 text-amber-400" />
                <span>दैनिक बिहानी तालिका र Webhook प्रसारण सेटिङ</span>
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                यहाँबाट तपाईंले दैनिक स्वचालित पोस्टिङ समय र बाह्य प्लेटफर्म (Zapier / Make.com / Meta Webhook) जोड्न सक्नुहुन्छ।
              </p>
            </div>

            <div className="space-y-5">
              {/* 1. Enable Toggle */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-black/40 border border-amber-500/20">
                <div>
                  <div className="text-sm font-bold text-white">दैनिक स्वचालित प्रसारण इन्जिन</div>
                  <div className="text-xs text-zinc-400">प्रत्येक बिहान स्वचालित रूपमा सामग्री जेनेरेट गरी प्रसारण गर्ने</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.enabled}
                    onChange={e => setSettings({ ...settings, enabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                </label>
              </div>

              {/* 2. Morning Time Picker */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-black/40 border border-amber-500/20">
                  <label className="block text-xs font-bold text-amber-300 mb-1">
                    बिहानी प्रसारण समय (Daily Morning Time):
                  </label>
                  <input
                    type="time"
                    value={settings.morningTime}
                    onChange={e => setSettings({ ...settings, morningTime: e.target.value })}
                    className="bg-zinc-900 border border-amber-500/30 text-white text-sm rounded-xl px-3 py-2 w-full focus:outline-none focus:border-amber-400"
                  />
                  <div className="text-[11px] text-zinc-400 mt-1">
                    सिफारिस समय: बिहान ०५:३० देखि ०६:३० बजे बीच
                  </div>
                </div>

                {/* Webhook URL Input */}
                <div className="p-4 rounded-2xl bg-black/40 border border-amber-500/20">
                  <label className="block text-xs font-bold text-amber-300 mb-1">
                    स्वचालित Webhook URL (Zapier / Make / Meta API):
                  </label>
                  <input
                    type="url"
                    placeholder="https://hook.make.com/... वा https://hooks.zapier.com/..."
                    value={settings.webhookUrl}
                    onChange={e => setSettings({ ...settings, webhookUrl: e.target.value })}
                    className="bg-zinc-900 border border-amber-500/30 text-white text-xs rounded-xl px-3 py-2 w-full focus:outline-none focus:border-amber-400"
                  />
                  <div className="text-[11px] text-zinc-400 mt-1">
                    यसमा प्रत्येक बिहान स्वतः JSON पेलोड तथा पोस्टहरू डेलिभर हुनेछ।
                  </div>
                </div>
              </div>

              {/* 3. Platform Toggles */}
              <div className="p-4 rounded-2xl bg-black/40 border border-amber-500/20 space-y-3">
                <div className="text-xs font-bold text-amber-300">सक्रिय प्लेटफर्महरू:</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { key: 'facebook', label: 'फेसबुक (Facebook)' },
                    { key: 'instagram', label: 'इन्स्टाग्राम (Instagram)' },
                    { key: 'tiktok', label: 'टिकटक (TikTok)' },
                    { key: 'youtube', label: 'युट्युब (YouTube)' }
                  ].map(p => (
                    <label key={p.key} className="flex items-center gap-2 cursor-pointer text-xs text-zinc-200">
                      <input
                        type="checkbox"
                        checked={settings.enabledPlatforms[p.key as keyof typeof settings.enabledPlatforms]}
                        onChange={e => setSettings({
                          ...settings,
                          enabledPlatforms: {
                            ...settings.enabledPlatforms,
                            [p.key]: e.target.checked
                          }
                        })}
                        className="rounded border-zinc-700 text-amber-500 focus:ring-amber-400"
                      />
                      <span>{p.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 4. Instructions in Nepali */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-xs text-zinc-300 space-y-2 leading-relaxed">
                <div className="font-bold text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>कसरी सिधै फेसबुक पेज वा इन्स्टाग्राममा स्वतः पोस्ट गर्ने? (Zero-Touch Setup Guide)</span>
                </div>
                <ol className="list-decimal list-inside space-y-1 text-zinc-300">
                  <li><strong>Make.com</strong> वा <strong>Zapier</strong> मा गई नि:शुल्क Custom Webhook सिर्जना गर्नुहोस्।</li>
                  <li>माथि दिइएको Webhook URL बक्समा उक्त लिङ्क पेस्ट गरी <strong>सुरक्षित गर्नुहोस्</strong> थिच्नुहोस्।</li>
                  <li>हाम्रो एपले प्रत्येक बिहान {settings.morningTime} बजे स्वतः आजको १२ वटै राशि, पञ्चाङ्ग र इमेज डेटा उक्त Webhook मा पठाउनेछ।</li>
                  <li>Make.com वा Zapier ले सिधै तपाईंको Facebook Page, Instagram Business, TikTok वा YouTube Community मा बिना कुनै झन्झट स्वतः पोस्ट गरिदिनेछ।</li>
                </ol>
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleSaveSettings}
                  disabled={isSavingSettings}
                  className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm cursor-pointer shadow-lg shadow-amber-500/20 flex items-center gap-2"
                >
                  {isSavingSettings ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>सेटिङ सुरक्षित गर्नुहोस्</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 4: BROADCAST LOGS & HISTORY
      ───────────────────────────────────────────────────────────── */}
      {activeSubTab === 'logs' && (
        <div className="space-y-4">
          <div className="bg-[#141624] border border-amber-500/30 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-amber-500/20">
              <div>
                <h3 className="text-lg font-bold text-amber-200 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-400" />
                  <span>प्रसारण इतिहास र गतिविधि लगहरू (Execution Logs)</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  विगतका स्वचालित तथा म्यानुअल प्रसारणको ताजा विवरण
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {logs.map(log => (
                <div
                  key={log.id}
                  className="p-4 rounded-2xl bg-black/40 border border-white/5 hover:border-amber-500/30 transition-all space-y-2"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      <span className="text-xs font-bold text-amber-200">{log.timestamp}</span>
                      <span className="text-xs text-zinc-400">({log.dateText})</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {log.platforms.map(p => (
                        <span key={p} className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 text-[10px] font-semibold border border-amber-500/20 uppercase">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-zinc-300 leading-relaxed">
                    {log.message}
                  </p>

                  {log.previewSnippet && (
                    <div className="text-[11px] text-zinc-500 bg-black/60 p-2.5 rounded-xl font-mono truncate">
                      {log.previewSnippet}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
