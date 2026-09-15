import { loadImage } from './imageAging';
import { FutureAge } from '../types';

export interface ShareCardOptions {
  originalImageSrc: string;
  futureImageSrc: string;
  years: FutureAge;
  habitsSummary?: string;
}

export async function generateShareCardCanvas({
  originalImageSrc,
  futureImageSrc,
  years,
  habitsSummary = 'Based on lifestyle habits & cellular projection',
}: ShareCardOptions): Promise<string> {
  const [originalImg, futureImg] = await Promise.all([
    loadImage(originalImageSrc),
    loadImage(futureImageSrc),
  ]);

  // Instagram Story / Modern mobile share resolution (1080 x 1420)
  const W = 1080;
  const H = 1420;

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context unavailable');

  // 1. Deep luxury dark background
  const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
  bgGrad.addColorStop(0, '#09090b');
  bgGrad.addColorStop(0.5, '#121216');
  bgGrad.addColorStop(1, '#050507');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  // Subtle ambient glow at top
  const glow = ctx.createRadialGradient(W / 2, 100, 50, W / 2, 200, 500);
  glow.addColorStop(0, 'rgba(255, 255, 255, 0.04)');
  glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, 500);

  // 2. Header: Logo & Branding
  ctx.save();
  // Logo pill mark
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(W / 2 - 86, 92, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#a1a1aa';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(W / 2 - 86, 92, 17, 0, Math.PI * 2);
  ctx.stroke();

  // App Name
  ctx.font = '800 38px "Plus Jakarta Sans", -apple-system, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('FutureMe', W / 2 - 56, 92);

  // Tagline
  ctx.font = '400 19px "Plus Jakarta Sans", -apple-system, sans-serif';
  ctx.fillStyle = '#a1a1aa';
  ctx.textAlign = 'center';
  ctx.fillText(`ME TODAY → ME IN ${years} YEARS`, W / 2, 156);
  ctx.restore();

  // 3. Side-by-side or stacked photo presentation
  // On a 1080w canvas, side-by-side with 460w x 640h each is breathtaking!
  const pad = 44;
  const cardW = 466;
  const cardH = 680;
  const cardY = 210;
  const cardRadius = 24;

  const x1 = pad;
  const x2 = W - pad - cardW;

  function roundRect(x: number, y: number, w: number, h: number, r: number) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r);
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h);
    ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
  }

  function drawCoverImage(img: HTMLImageElement, x: number, y: number, w: number, h: number) {
    ctx.save();
    roundRect(x, y, w, h, cardRadius);
    ctx.clip();

    const imgRatio = img.naturalWidth / img.naturalHeight;
    const boxRatio = w / h;
    let sW = img.naturalWidth;
    let sH = img.naturalHeight;
    let sX = 0;
    let sY = 0;

    if (imgRatio > boxRatio) {
      sW = img.naturalHeight * boxRatio;
      sX = (img.naturalWidth - sW) / 2;
    } else {
      sH = img.naturalWidth / boxRatio;
      sY = (img.naturalHeight - sH) / 2;
    }

    ctx.drawImage(img, sX, sY, sW, sH, x, y, w, h);

    // Subtle bottom vignette for label legibility
    const grad = ctx.createLinearGradient(0, y + h - 140, 0, y + h);
    grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0.7)');
    ctx.fillStyle = grad;
    ctx.fillRect(x, y + h - 140, w, 140);

    ctx.restore();

    // Border stroke
    ctx.save();
    roundRect(x, y, w, h, cardRadius);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  }

  // Draw Left: YOU TODAY
  drawCoverImage(originalImg, x1, cardY, cardW, cardH);

  // Label Left
  ctx.save();
  // Pill badge
  ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
  roundRect(x1 + 24, cardY + cardH - 72, 170, 44, 22);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.font = '700 16px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('YOU TODAY', x1 + 109, cardY + cardH - 50);
  ctx.restore();

  // Draw Right: YOU IN [X] YEARS
  drawCoverImage(futureImg, x2, cardY, cardW, cardH);

  // Label Right
  ctx.save();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
  roundRect(x2 + 24, cardY + cardH - 72, 210, 44, 22);
  ctx.fill();

  ctx.font = '800 16px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#09090b';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`YOU IN ${years} YEARS`, x2 + 129, cardY + cardH - 50);
  ctx.restore();

  // 4. Center Arrow Accent between images
  ctx.save();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.beginPath();
  ctx.arc(W / 2, cardY + cardH / 2, 28, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#09090b';
  // Arrow right shape
  ctx.beginPath();
  ctx.moveTo(W / 2 - 8, cardY + cardH / 2 - 9);
  ctx.lineTo(W / 2 + 8, cardY + cardH / 2);
  ctx.lineTo(W / 2 - 8, cardY + cardH / 2 + 9);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // 5. Narrative Card at bottom
  const infoY = cardY + cardH + 40;
  const infoH = 240;
  ctx.save();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
  roundRect(pad, infoY, W - pad * 2, infoH, 24);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Info header
  ctx.font = '700 24px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(`+${years} Year Lifestyle Projection`, pad + 36, infoY + 34);

  // Subtitle
  ctx.font = '400 19px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#a1a1aa';
  ctx.fillText(habitsSummary, pad + 36, infoY + 76);

  // Feature badge highlights
  const badges = ['Cellular Aging', 'UV Balance', 'Sleep Elasticity'];
  let bX = pad + 36;
  badges.forEach((b) => {
    ctx.font = '600 16px "Plus Jakarta Sans", sans-serif';
    const textWidth = ctx.measureText(b).width;
    const bW = textWidth + 34;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    roundRect(bX, infoY + 130, bW, 38, 19);
    ctx.fill();

    ctx.fillStyle = '#e4e4e7';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(b, bX + bW / 2, infoY + 149);

    bX += bW + 14;
  });

  ctx.restore();

  // 6. Disclaimer & Footer
  ctx.save();
  ctx.font = '400 16px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#71717a';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Your future self is an AI visualization, not a prediction.', W / 2, H - 90);

  ctx.font = '500 15px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#52525b';
  ctx.fillText('Created with FutureMe • futureme.app', W / 2, H - 56);
  ctx.restore();

  return canvas.toDataURL('image/png');
}

export function downloadDataUrl(dataUrl: string, filename: string) {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
