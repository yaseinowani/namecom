import { AppraisalResult } from './appraiser';
import { Language, I18N } from './i18n';

export async function exportCertificateAsPng(
  result: AppraisalResult,
  langProp?: Language
): Promise<void> {
  const lang = langProp || result.lang || 'ja';
  const t = I18N[lang];

  if (typeof document !== 'undefined' && document.fonts) {
    try {
      await document.fonts.ready;
    } catch {
      // Ignore
    }
  }

  return new Promise((resolve, reject) => {
    try {
      const width = 1200;
      const height = 900;
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Canvas 2D context not available');
      }

      // Background with authentic certificate parchment tone
      ctx.fillStyle = '#FCFBF8';
      ctx.fillRect(0, 0, width, height);

      // Fine security watermark pattern
      ctx.fillStyle = 'rgba(15, 23, 42, 0.025)';
      for (let x = 60; x < width - 60; x += 32) {
        for (let y = 120; y < height - 60; y += 32) {
          ctx.beginPath();
          ctx.arc(x, y, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Certificate Outer Border
      ctx.strokeStyle = '#0F172A';
      ctx.lineWidth = 6;
      ctx.strokeRect(36, 36, width - 72, height - 72);

      // Thin inner hairline border
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 2;
      ctx.strokeRect(48, 48, width - 96, height - 96);

      // Header Band
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(48, 48, width - 96, 56);

      ctx.fillStyle = '#F8FAFC';
      ctx.font = 'bold 20px "KeiFont", "Zen Kaku Gothic New", sans-serif';
      ctx.fillText(t.certHeader, 72, 84);

      ctx.font = 'bold 18px "JetBrains Mono", monospace';
      ctx.textAlign = 'right';
      ctx.fillText(`${result.certificateNumber}  ·  ${result.timestamp}`, width - 72, 84);
      ctx.textAlign = 'left';

      // Title Badge
      ctx.fillStyle = '#B45309';
      ctx.font = 'bold 18px "KeiFont", "Zen Kaku Gothic New", sans-serif';
      ctx.fillText(result.titleBadge, 72, 160);

      // Target Name
      ctx.fillStyle = '#020617';
      ctx.font = '900 48px "KeiFont", "Zen Kaku Gothic New", sans-serif';
      ctx.fillText(result.name, 72, 218);

      // Rarity Tier Badge
      const rarityText = `${result.rarity} · ${result.raritySub}`;
      ctx.fillStyle = '#0F172A';
      ctx.beginPath();
      ctx.roundRect(width - 340, 145, 150, 40, 8);
      ctx.fill();

      ctx.fillStyle = '#F8FAFC';
      ctx.font = 'bold 16px "JetBrains Mono", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(rarityText, width - 340 + 75, 171);
      ctx.textAlign = 'left';

      // Hanko Stamp (Enlarged)
      const stampX = width - 150;
      const stampY = 190;
      const stampRadius = 72;

      ctx.save();
      ctx.translate(stampX, stampY);
      ctx.rotate((-12 * Math.PI) / 180);

      ctx.strokeStyle = '#DC2626';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(0, 0, stampRadius, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#DC2626';
      ctx.textAlign = 'center';
      ctx.font = '900 20px "KeiFont", "Zen Kaku Gothic New", sans-serif';
      ctx.fillText(t.stampText.top, 0, -28);

      ctx.strokeStyle = '#DC2626';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-44, -10);
      ctx.lineTo(44, -10);
      ctx.moveTo(-44, 18);
      ctx.lineTo(44, 18);
      ctx.stroke();

      ctx.font = '900 22px "KeiFont", "Zen Kaku Gothic New", sans-serif';
      ctx.fillText(t.stampText.mid, 0, 9);

      ctx.font = '900 20px "KeiFont", "Zen Kaku Gothic New", sans-serif';
      ctx.fillText(t.stampText.btm, 0, 46);
      ctx.restore();

      // Divider line
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(72, 255);
      ctx.lineTo(width - 72, 255);
      ctx.stroke();

      // Price Hero Box
      ctx.fillStyle = '#F8FAFC';
      ctx.beginPath();
      ctx.roundRect(72, 275, width - 144, 210, 16);
      ctx.fill();
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#64748B';
      ctx.font = 'bold 18px "KeiFont", "Zen Kaku Gothic New", sans-serif';
      ctx.fillText(t.certValueLabel, 104, 315);

      ctx.fillStyle = '#0F172A';
      ctx.font = '900 68px "KeiFont", "Zen Kaku Gothic New", sans-serif';
      ctx.fillText(result.formattedJapaneseUnit, 104, 395);

      ctx.fillStyle = '#64748B';
      ctx.font = 'bold 20px "JetBrains Mono", monospace';
      ctx.fillText(`${t.certCalculatedAmount}${result.formattedYen}`, 104, 435);

      ctx.fillStyle = '#334155';
      ctx.font = 'bold 18px "KeiFont", "Zen Kaku Gothic New", sans-serif';
      ctx.fillText(`${t.certEquivalentLabel}${result.equivalentItem}`, 104, 468);

      // Stats 5 items
      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 20px "KeiFont", "Zen Kaku Gothic New", sans-serif';
      ctx.fillText(t.tabStats, 72, 530);

      const startY = 560;
      const colW = (width - 144 - 40) / 2;

      result.stats.forEach((stat, i) => {
        const col = i % 2;
        const row = Math.floor(i / 2);
        const x = 72 + col * (colW + 40);
        const y = startY + row * 45;

        ctx.fillStyle = '#1E293B';
        ctx.font = 'bold 16px "KeiFont", "Zen Kaku Gothic New", sans-serif';
        ctx.fillText(stat.label, x, y + 16);

        ctx.textAlign = 'right';
        ctx.font = '900 16px "JetBrains Mono", monospace';
        ctx.fillText(`${stat.rank}  ${stat.score}${lang === 'en' ? ' pts' : '点'}`, x + colW, y + 16);
        ctx.textAlign = 'left';

        // Bar background
        ctx.fillStyle = '#E2E8F0';
        ctx.beginPath();
        ctx.roundRect(x, y + 24, colW, 8, 4);
        ctx.fill();

        // Bar fill
        ctx.fillStyle = '#D97706';
        ctx.beginPath();
        ctx.roundRect(x, y + 24, (colW * stat.score) / 100, 8, 4);
        ctx.fill();
      });

      // Bottom Note
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(72, height - 90);
      ctx.lineTo(width - 72, height - 90);
      ctx.stroke();

      ctx.fillStyle = '#94A3B8';
      ctx.font = '14px "KeiFont", "Zen Kaku Gothic New", sans-serif';
      ctx.fillText(t.certFooterNote, 72, height - 58);

      ctx.textAlign = 'right';
      ctx.fillStyle = '#475569';
      ctx.font = 'bold 16px "KeiFont", "Zen Kaku Gothic New", sans-serif';
      ctx.fillText(t.shareHashtags, width - 72, height - 58);

      // Trigger download
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `Certificate_${result.name.replace(/\s+/g, '_')}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      resolve();
    } catch (err) {
      reject(err);
    }
  });
}
