// Vedic Sound Synthesizer and Crystal-Clear Nepali Speech Engine

let audioCtx: AudioContext | null = null;
let currentAudioSource: AudioBufferSourceNode | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Plays a sacred Tibetan Singing Bowl / Temple Bell sound
 */
export function playTempleBell(): void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const rootFreq = 432; // Healing cosmic frequency
    const harmonics = [1, 2.01, 3.01, 4.02, 5.04];
    const gains = [0.4, 0.25, 0.15, 0.08, 0.04];

    harmonics.forEach((h, i) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(rootFreq * h, now);

      // Bell decay curve
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(gains[i], now + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 3.5);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 3.5);
    });
  } catch (e) {
    console.warn('Audio playback error:', e);
  }
}

/**
 * Plays a gentle Om chime
 */
export function playOmChime(): void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const baseFreq = 136.1; // Frequency of Om (Earth Year frequency)
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(baseFreq, now);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(baseFreq * 2, now);

    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.3, now + 0.5);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 4.0);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 4.0);
    osc2.stop(now + 4.0);
  } catch (e) {
    console.warn('Audio playback error:', e);
  }
}

/**
 * Helper to convert numbers to clear Nepali spoken words
 */
function cleanNepaliTextForSpeech(text: string): string {
  const nepaliNumbers: Record<string, string> = {
    '०': 'शून्य',
    '१': 'एक',
    '२': 'दुई',
    '३': 'तीन',
    '४': 'चार',
    '५': 'पाँच',
    '६': 'छ',
    '७': 'सात',
    '८': 'आठ',
    '९': 'नौ',
    '१०': 'दश',
    '1': 'एक',
    '2': 'दुई',
    '3': 'तीन',
    '4': 'चार',
    '5': 'पाँच',
    '6': 'छ',
    '7': 'सात',
    '8': 'आठ',
    '9': 'नौ',
    '10': 'दश'
  };

  let clean = text
    .replace(/[•★*#\-_/]/g, ' ')
    .replace(/[:]/g, ', ')
    .replace(/\s+/g, ' ');

  // Replace single digit numbers with spoken words for crisp audio
  Object.keys(nepaliNumbers).forEach((num) => {
    const reg = new RegExp(`\\b${num}\\b|(?<=\\s)${num}(?=\\s|[।,.])`, 'g');
    clean = clean.replace(reg, nepaliNumbers[num]);
  });

  return clean.trim();
}

/**
 * Plays PCM 24000Hz base64 audio via Web Audio API
 */
function playPcmAudio(base64Data: string, onEnd?: () => void): () => void {
  try {
    const ctx = getAudioContext();
    const binary = atob(base64Data);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    
    const int16Array = new Int16Array(bytes.buffer);
    const audioBuffer = ctx.createBuffer(1, int16Array.length, 24000);
    const channelData = audioBuffer.getChannelData(0);
    for (let i = 0; i < int16Array.length; i++) {
      channelData[i] = int16Array[i] / 32768.0;
    }

    if (currentAudioSource) {
      try {
        currentAudioSource.stop();
      } catch {}
    }

    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(ctx.destination);

    currentAudioSource = source;

    source.onended = () => {
      if (currentAudioSource === source) {
        currentAudioSource = null;
      }
      if (onEnd) onEnd();
    };

    source.start();

    return () => {
      try {
        source.stop();
      } catch {}
      if (currentAudioSource === source) {
        currentAudioSource = null;
      }
    };
  } catch (err) {
    console.error('Error playing neural PCM audio:', err);
    if (onEnd) onEnd();
    return () => {};
  }
}

/**
 * Fallback browser SpeechSynthesis with calibrated Devanagari clarity & slow cadence
 */
function speakBrowserSpeech(text: string, onEnd?: () => void): () => void {
  if (!('speechSynthesis' in window)) {
    if (onEnd) onEnd();
    return () => {};
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.82; // Slower cadence for 100% clarity and clear pronunciation in Nepali
  utterance.pitch = 1.0;

  const selectVoice = () => {
    const voices = window.speechSynthesis.getVoices();
    // Prioritize Nepali, then Hindi Devanagari voices
    const nepaliVoice = voices.find(v => v.lang.startsWith('ne'));
    const hindiVoice = voices.find(v => 
      v.lang.startsWith('hi') || 
      v.name.toLowerCase().includes('hindi') || 
      v.name.toLowerCase().includes('lekha') ||
      v.name.toLowerCase().includes('neerja') ||
      v.name.toLowerCase().includes('kalpana')
    );

    if (nepaliVoice) {
      utterance.voice = nepaliVoice;
      utterance.lang = nepaliVoice.lang;
    } else if (hindiVoice) {
      utterance.voice = hindiVoice;
      utterance.lang = hindiVoice.lang;
    } else {
      utterance.lang = 'hi-IN';
    }
  };

  selectVoice();

  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = selectVoice;
  }

  if (onEnd) {
    utterance.onend = onEnd;
    utterance.onerror = onEnd;
  }

  window.speechSynthesis.speak(utterance);

  return () => {
    window.speechSynthesis.cancel();
  };
}

/**
 * Primary function: Reads Horoscope in crystal-clear Nepali.
 * Tries server-side neural speech first, then gracefully falls back to tuned browser speech.
 */
export function speakHoroscopeText(
  text: string, 
  onEnd?: () => void
): () => void {
  const cleanedText = cleanNepaliTextForSpeech(text);
  let isCancelled = false;
  let cancelActivePlayback: (() => void) | null = null;

  // Stop any ongoing browser speech synthesis or audio context playback
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  if (currentAudioSource) {
    try {
      currentAudioSource.stop();
    } catch {}
    currentAudioSource = null;
  }

  // Attempt server-side neural TTS for authentic, ultra-clear Nepali voice
  fetch('/api/tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: cleanedText })
  })
    .then(res => res.json())
    .then(data => {
      if (isCancelled) return;

      if (data.success && data.audioData) {
        cancelActivePlayback = playPcmAudio(data.audioData, () => {
          if (!isCancelled && onEnd) onEnd();
        });
      } else {
        // Fallback to tuned browser speech synthesis
        cancelActivePlayback = speakBrowserSpeech(cleanedText, () => {
          if (!isCancelled && onEnd) onEnd();
        });
      }
    })
    .catch(err => {
      console.warn('Neural TTS request failed, using browser speech engine:', err);
      if (isCancelled) return;
      cancelActivePlayback = speakBrowserSpeech(cleanedText, () => {
        if (!isCancelled && onEnd) onEnd();
      });
    });

  return () => {
    isCancelled = true;
    if (cancelActivePlayback) {
      cancelActivePlayback();
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (currentAudioSource) {
      try {
        currentAudioSource.stop();
      } catch {}
      currentAudioSource = null;
    }
  };
}
