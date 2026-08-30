import { PanchangInfo, RasiInfo, SocialPostDraft, SocialPlatform } from '../types';

/**
 * Generates formatted, ready-to-post content for all major social media platforms
 */
export function generateSocialMediaPosts(
  panchang: PanchangInfo,
  rasis: RasiInfo[]
): Record<SocialPlatform, SocialPostDraft> {
  const dateStr = panchang.bsDate;
  const tithiStr = `${panchang.tithi} (${panchang.paksha})`;
  const nakshatraStr = panchang.nakshatra;
  const rahuKaalStr = panchang.rahuKaal;
  const abhijitStr = panchang.abhijitMuhurat;

  // 1. FACEBOOK DRAFT (Comprehensive, beautifully formatted with emojis & dividers)
  const fbRasiBullets = rasis
    .map(r => {
      const daily = r.daily;
      return `${r.symbolEmoji} ${r.nepaliName} (${r.englishName}): ${daily.summary} (शुभ रङ्ग: ${daily.luckyColor}, शुभ अङ्क: ${daily.luckyNumber})`;
    })
    .join('\n\n');

  const facebookContent = `🚩 दैनिक राशिफल तथा पञ्चाङ्ग 🚩
📅 मिति: ${dateStr}
🕉️ तिथि: ${tithiStr} | नक्षत्र: ${nakshatraStr}
☀️ सूर्योदय: ${panchang.suryodaya} | सूर्यास्त: ${panchang.suryasta}
⏱️ शुभ मुहूर्त (अभिजीत): ${abhijitStr}
⚠️ राहुकाल: ${rahuKaalStr}

━━━━━━━━━━━━━━━━━━━
🔮 आजको १२ राशि फल (Daily Horoscope)
━━━━━━━━━━━━━━━━━━━

${fbRasiBullets}

━━━━━━━━━━━━━━━━━━━
🌺 आजको विशेष वैदिक मन्त्र:
"ॐ नमो भगवते वासुदेवाय नमः"

✨ आफ्नो राशि अनुसार विस्तृत फल, दशा तथा शुभ मुहूर्त जान्नको लागि हाम्रो दैनिक पञ्चाङ्ग तथा राशिफल एपमा जोडिनुहोस्। 
शुभ दिनको मङ्गलमय शुभकामना! 🙏

#दैनिकराशिफल #नेपालीपञ्चाङ्ग #DailyRashifal #NepalAstrology #NepaliCalendar #RashifalToday #आजकोराशिफल #पञ्चाङ्ग`;

  // 2. INSTAGRAM DRAFT (Engaging, clean aesthetic formatting with bullet points and hashtag cluster)
  const instaRasiHighlights = rasis
    .map(r => `• ${r.symbolEmoji} ${r.nepaliName}: ${r.daily.highlights?.[0] || r.daily.summary.slice(0, 50)}... [शुभ अङ्क: ${r.daily.luckyNumber}]`)
    .join('\n');

  const instagramContent = `✨ आजको राशिफल तथा पञ्चाङ्ग | ${dateStr} 🪐

📌 पञ्चाङ्ग विवरण:
- तिथि: ${tithiStr}
- नक्षत्र: ${nakshatraStr}
- शुभ अभिजित मुहूर्त: ${abhijitStr}
- राहुकाल: ${rahuKaalStr}

🌟 १२ राशिको संक्षिप्त फल (Swipe for details 👉):
${instaRasiHighlights}

💡 आजको उपाय: बिहान स्नान गरी सूर्य भगवानलाई जल अर्पण गर्नुहोला।

💬 तपाईंको राशि कुन हो? कमेन्टमा बताउनुहोस्!
❤️ पोस्ट मन परे सेभ र सेयर गर्नुहोला।

.
.
#nepalirashifal #nepaliastrology #nepalipanchang #panchang #nepalihoroscope #rashifal #nepal #kathmandu #dailyhoroscope #jyotish #astrologynepal #rashifaltoday`;

  // 3. TIKTOK SCRIPT & CAPTION (Fast-paced 60s viral video voiceover & caption)
  const tiktokScript = `🎬 भिडियो स्क्रिप्ट (Voiceover Duration: 50-60 Sec):

[00:00 - 00:05] (हुक) 
"नमस्कार! आज ${dateStr} को दिन तपाईंका लागि कस्तो रहनेछ? आउनुहोस् जानौं आजको पञ्चाङ्ग र १२ राशिको फल।"

[00:05 - 00:18] (पञ्चाङ्ग र शुभ समय)
"आज ${tithiStr} र ${nakshatraStr} नक्षत्र रहेको छ। आजको शुभ अभिजित मुहूर्त ${abhijitStr} मा रहनेछ भने राहुकाल ${rahuKaalStr} सम्म रहनेछ।"

[00:18 - 00:45] (मुख्य भाग्यशाली राशिहरू)
"आज मेष, सिंह र धनु राशिका लागि धनलाभ तथा नयाँ अवसरको उत्तम योग छ। वृष, तुला र कुम्भ राशिले बोली र स्वास्थ्यमा विशेष ध्यान दिनुहोला। अन्य राशिका लागि दिन मध्यम फलदायी रहनेछ।"

[00:45 - 00:55] (आजको महामन्त्र र उपाय)
"आजको दिनलाई अझ शुभ बनाउन 'ॐ नमः शिवाय' मन्त्रको स्मरण गर्नुहोस्।"

[00:55 - 01:00] (आउट्रो)
"आफ्नो राशिको विस्तृत फल थाहा पाउन भिडियोलाई लाइक, फलो र कमेन्ट गर्नुहोस्। जय श्री पशुपतिनाथ!"`;

  const tiktokContent = `आजको राशिफल र पञ्चाङ्ग (${dateStr}) 🕉️✨ कुन राशिलाई छ आज बम्पर धनलाभ? हेर्नुहोस् पूरा भिडियो! #tiktoknepal #rashifal #foryou #fyp #nepaliastrology #nepal #dailyhoroscope #jyotishnepal`;

  // 4. YOUTUBE DRAFT (Community Tab post + Video/Shorts Title, Description & Timestamps)
  const ytTimestamps = rasis
    .map((r, i) => {
      const min = Math.floor((i * 30 + 40) / 60);
      const sec = (i * 30 + 40) % 60;
      const timeStr = `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
      return `${timeStr} - ${r.nepaliName} (${r.englishName})`;
    })
    .join('\n');

  const youtubeContent = `📌 भिडियो शीर्षक (Title):
आजको दैनिक राशिफल र शुभ पञ्चाङ्ग | ${dateStr} | Daily Horoscope Nepal | ${rasis[0].nepaliName} देखि ${rasis[11].nepaliName}

📝 भिडियो विवरण (Description):
दैनिक राशिफल तथा पञ्चाङ्गमा स्वागत छ।
यस भिडियोमा हामीले आज ${dateStr} को पञ्चाङ्ग, सूर्योदय, सूर्यास्त, राहुकाल, शुभ अभिजित मुहूर्त तथा १२ वटै राशिका विस्तृत फलादेश प्रस्तुत गरेका छौं।

⏱️ समय तालिका (Timestamps):
00:00 - आजको पञ्चाङ्ग तथा शुभ मुहूर्त
00:20 - आजको ग्रह गोचर
${ytTimestamps}

🔔 हाम्रो च्यानललाई Subscribe गरी दैनिक पञ्चाङ्ग र राशिफलको ताजा अपडेट प्राप्त गर्नुहोस्।
जय श्री पशुपतिनाथ! 🙏

#NepaliRashifal #DailyHoroscope #NepalPanchang #AstrologyNepal #NepaliAstrologer`;

  return {
    facebook: {
      platform: 'facebook',
      platformNameNe: 'फेसबुक (Facebook)',
      title: `🚩 दैनिक राशिफल तथा पञ्चाङ्ग • ${dateStr}`,
      content: facebookContent,
      hashtags: ['#दैनिकराशिफल', '#नेपालीपञ्चाङ्ग', '#DailyRashifal', '#NepalAstrology'],
      cardHeadline: `दैनिक राशिफल • ${dateStr}`
    },
    instagram: {
      platform: 'instagram',
      platformNameNe: 'इन्स्टाग्राम (Instagram)',
      title: `✨ आजको राशिफल र पञ्चाङ्ग | ${dateStr}`,
      content: instagramContent,
      hashtags: ['#nepalirashifal', '#nepaliastrology', '#panchang', '#dailyhoroscope'],
      cardHeadline: `दैनिक राशिफल तथा पञ्चाङ्ग`
    },
    tiktok: {
      platform: 'tiktok',
      platformNameNe: 'टिकटक (TikTok)',
      title: `🎬 टिकटक भिडियो स्क्रिप्ट र क्याप्सन`,
      content: tiktokContent,
      shortScript: tiktokScript,
      suggestedMusic: 'Om Chanting / Flute Instrumental / Peaceful Vedic Melody',
      hashtags: ['#tiktoknepal', '#rashifal', '#foryou', '#fyp', '#nepal'],
      cardHeadline: `आजको राशिफल भिडियो कार्ड`
    },
    youtube: {
      platform: 'youtube',
      platformNameNe: 'युट्युब (YouTube)',
      title: `आजको दैनिक राशिफल र शुभ पञ्चाङ्ग | ${dateStr}`,
      content: youtubeContent,
      hashtags: ['#NepaliRashifal', '#DailyHoroscope', '#NepalPanchang'],
      cardHeadline: `दैनिक राशिफल भिडियो विवरण`
    }
  };
}

export type CardAspectRatio = 'square' | 'vertical' | 'landscape';

/**
 * Draws high-resolution Vedic Horoscope & Panchang cards on an HTML Canvas for export/download
 */
export function drawSocialCardToCanvas(
  canvas: HTMLCanvasElement,
  options: {
    panchang: PanchangInfo;
    rasi?: RasiInfo; // If undefined, draws master 12-rasi overview card
    rasis?: RasiInfo[];
    aspectRatio: CardAspectRatio;
    brandName?: string;
  }
): void {
  const { panchang, rasi, rasis = [], aspectRatio, brandName = 'दैनिक राशिफल र पञ्चाङ्ग' } = options;

  let width = 1080;
  let height = 1080;

  if (aspectRatio === 'vertical') {
    width = 1080;
    height = 1920;
  } else if (aspectRatio === 'landscape') {
    width = 1200;
    height = 630;
  }

  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // 1. Rich Background Gradient (Vedic Crimson-Navy Gold Palette)
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#1c0c16'); // Deep mystical crimson
  bgGrad.addColorStop(0.4, '#0e101f'); // Cosmic deep indigo
  bgGrad.addColorStop(1, '#180b20'); // Sacred violet
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Decorative Golden Glow Radial Gradients
  const radialGlow = ctx.createRadialGradient(width / 2, 200, 10, width / 2, 200, width / 1.5);
  radialGlow.addColorStop(0, 'rgba(245, 158, 11, 0.18)');
  radialGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = radialGlow;
  ctx.fillRect(0, 0, width, height);

  // 3. Ornate Double Golden Border
  const pad = aspectRatio === 'vertical' ? 36 : 28;
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 4;
  ctx.strokeRect(pad, pad, width - pad * 2, height - pad * 2);

  ctx.strokeStyle = 'rgba(251, 191, 36, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(pad + 8, pad + 8, width - (pad + 8) * 2, height - (pad + 8) * 2);

  // Corner Ornaments
  const cornerSize = 24;
  const drawCorner = (x: number, y: number) => {
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.fill();
  };
  drawCorner(pad + 8, pad + 8);
  drawCorner(width - pad - 8, pad + 8);
  drawCorner(pad + 8, height - pad - 8);
  drawCorner(width - pad - 8, height - pad - 8);

  // 4. Header Section: Om Symbol & App Name
  ctx.fillStyle = '#fef3c7';
  ctx.font = 'bold 36px serif';
  ctx.textAlign = 'center';
  ctx.fillText('ॐ', width / 2, pad + 45);

  ctx.fillStyle = '#fbbf24';
  ctx.font = 'bold 28px sans-serif';
  ctx.fillText(brandName, width / 2, pad + 80);

  // Date Banner
  ctx.fillStyle = 'rgba(245, 158, 11, 0.2)';
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.5)';
  ctx.lineWidth = 1;
  const bannerW = width - pad * 4;
  const bannerH = 44;
  const bannerY = pad + 100;
  ctx.fillRect((width - bannerW) / 2, bannerY, bannerW, bannerH);
  ctx.strokeRect((width - bannerW) / 2, bannerY, bannerW, bannerH);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 20px sans-serif';
  ctx.fillText(
    `📅 ${panchang.bsDate}  •  ${panchang.tithi} (${panchang.paksha})`,
    width / 2,
    bannerY + 29
  );

  // 5. CONTENT RENDERING: Single Rasi Card OR Master 12-Rasis Overview Card
  if (rasi) {
    // SINGLE RASI FOCUSED CARD
    const contentStartY = bannerY + bannerH + 40;

    // Rasi Symbol Circle Box
    const iconCenterY = contentStartY + (aspectRatio === 'vertical' ? 120 : 70);
    const iconGrad = ctx.createLinearGradient(width / 2 - 70, iconCenterY - 70, width / 2 + 70, iconCenterY + 70);
    iconGrad.addColorStop(0, '#f59e0b');
    iconGrad.addColorStop(1, '#b91c1c');
    ctx.fillStyle = iconGrad;
    ctx.beginPath();
    ctx.arc(width / 2, iconCenterY, 65, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = '56px sans-serif';
    ctx.fillText(rasi.symbol, width / 2, iconCenterY + 20);

    // Namakshyar Pill
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1;
    const namePillY = iconCenterY + 80;
    const pillW = Math.min(width - 120, 600);
    ctx.fillRect((width - pillW) / 2, namePillY, pillW, 36);
    ctx.strokeRect((width - pillW) / 2, namePillY, pillW, 36);

    ctx.fillStyle = '#fde68a';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText(`नामाक्षर: ${rasi.nepaliNamakshyar} (${rasi.englishNamakshyar})`, width / 2, namePillY + 24);

    // Rasi Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 42px sans-serif';
    ctx.fillText(`${rasi.nepaliName} (${rasi.englishName})`, width / 2, namePillY + 85);

    // Planetary Lord & Element
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '20px sans-serif';
    ctx.fillText(`स्वामी: ${rasi.lord}  |  तत्व: ${rasi.element}  |  मित्र राशि: ${rasi.friendlyRasi}`, width / 2, namePillY + 120);

    // Lucky Badges Grid (3 Boxes)
    const badgeY = namePillY + 150;
    const boxW = (width - 140) / 3;
    const boxH = 65;

    const drawBadge = (idx: number, label: string, val: string, color: string) => {
      const bx = 60 + idx * (boxW + 10);
      ctx.fillStyle = 'rgba(18, 20, 32, 0.8)';
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.fillRect(bx, badgeY, boxW, boxH);
      ctx.strokeRect(bx, badgeY, boxW, boxH);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '14px sans-serif';
      ctx.fillText(label, bx + boxW / 2, badgeY + 24);

      ctx.fillStyle = color;
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText(val, bx + boxW / 2, badgeY + 50);
    };

    drawBadge(0, 'शुभ रङ्ग', rasi.daily.luckyColor, '#fde047');
    drawBadge(1, 'शुभ अङ्क', rasi.daily.luckyNumber, '#38bdf8');
    drawBadge(2, 'शुभ दिशा', rasi.daily.luckyDirection, '#4ade80');

    // Main Horoscope Forecast Box
    const textCardY = badgeY + boxH + 25;
    const textCardH = aspectRatio === 'vertical' ? 680 : aspectRatio === 'landscape' ? 120 : 340;
    const textCardW = width - 120;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.3)';
    ctx.lineWidth = 1.5;
    ctx.fillRect(60, textCardY, textCardW, textCardH);
    ctx.strokeRect(60, textCardY, textCardW, textCardH);

    // Wrapped Forecast Text
    ctx.fillStyle = '#f1f5f9';
    ctx.font = '22px sans-serif';
    ctx.textAlign = 'left';

    const textToWrap = rasi.daily.summary + ` पेशा तथा व्यवसाय: ${rasi.daily.career} आर्थिक स्थिति: ${rasi.daily.wealth}`;
    const maxLineW = textCardW - 40;
    const lineHeight = 34;
    let curX = 80;
    let curY = textCardY + 45;

    const words = textToWrap.split(' ');
    let line = '';

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxLineW && n > 0) {
        if (curY < textCardY + textCardH - 40) {
          ctx.fillText(line, curX, curY);
          line = words[n] + ' ';
          curY += lineHeight;
        }
      } else {
        line = testLine;
      }
    }
    if (curY < textCardY + textCardH - 20) {
      ctx.fillText(line, curX, curY);
    }

    // Sacred Mantra Box at bottom
    if (aspectRatio === 'vertical') {
      const mantraY = textCardY + textCardH + 30;
      ctx.fillStyle = 'rgba(245, 158, 11, 0.15)';
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 1.5;
      ctx.fillRect(60, mantraY, width - 120, 100);
      ctx.strokeRect(60, mantraY, width - 120, 100);

      ctx.textAlign = 'center';
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText(`🌺 ${rasi.nepaliName}को वैदिक बीज मन्त्र:`, width / 2, mantraY + 35);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px serif';
      ctx.fillText(`"${rasi.vedicMantra}"`, width / 2, mantraY + 75);
    }
  } else {
    // MASTER 12 RASI OVERVIEW CARD (Grid of all 12 Rasis)
    const gridY = bannerY + bannerH + 25;
    const cols = 3;
    const rows = 4;
    const cellW = (width - pad * 2 - 30) / cols;
    const cellH = (height - gridY - pad - 60) / rows;

    ctx.textAlign = 'left';

    rasis.slice(0, 12).forEach((r, idx) => {
      const c = idx % cols;
      const row = Math.floor(idx / cols);
      const cx = pad + 15 + c * cellW;
      const cy = gridY + row * cellH;

      // Cell box
      ctx.fillStyle = 'rgba(20, 23, 38, 0.75)';
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.25)';
      ctx.lineWidth = 1;
      ctx.fillRect(cx + 4, cy + 4, cellW - 8, cellH - 8);
      ctx.strokeRect(cx + 4, cy + 4, cellW - 8, cellH - 8);

      // Header inside cell
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText(`${r.symbolEmoji} ${r.nepaliName}`, cx + 12, cy + 28);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px sans-serif';
      ctx.fillText(`(${r.englishName})`, cx + 120, cy + 28);

      // Short summary
      ctx.fillStyle = '#e2e8f0';
      ctx.font = '13px sans-serif';
      const shortSum = r.daily.summary.slice(0, 48) + '...';
      ctx.fillText(shortSum, cx + 12, cy + 50);

      // Lucky number & color
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(`अङ्क: ${r.daily.luckyNumber} | रङ्ग: ${r.daily.luckyColor}`, cx + 12, cy + cellH - 14);
    });
  }

  // 6. Universal Footer
  ctx.textAlign = 'center';
  ctx.fillStyle = '#94a3b8';
  ctx.font = '14px sans-serif';
  ctx.fillText(
    `शुभ समय (अभिजित): ${panchang.abhijitMuhurat}  •  राहुकाल: ${panchang.rahuKaal}`,
    width / 2,
    height - pad - 18
  );
}
