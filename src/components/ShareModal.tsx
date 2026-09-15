import React, { useState, useEffect } from 'react';
import { X, Download, Share2, Check, RefreshCw, Sparkles } from 'lucide-react';
import { generateShareCardCanvas, downloadDataUrl } from '../utils/generateShareCard';
import { GenerationResult } from '../types';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: GenerationResult;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  result,
}) => {
  const [shareCardUrl, setShareCardUrl] = useState<string | null>(null);
  const [isRendering, setIsRendering] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setShareCardUrl(null);
      return;
    }

    setIsRendering(true);
    const habitsSummary = `Habit Projection • ${result.habits.exercise} exercise • ${result.habits.sleep.replace('_', ' ')}h sleep`;

    generateShareCardCanvas({
      originalImageSrc: result.originalImage,
      futureImageSrc: result.futureImage,
      years: result.years,
      habitsSummary,
    })
      .then((dataUrl) => {
        setShareCardUrl(dataUrl);
        setIsRendering(false);
      })
      .catch((err) => {
        console.error('Failed to generate share card canvas:', err);
        setIsRendering(false);
      });
  }, [isOpen, result]);

  if (!isOpen) return null;

  const handleDownload = () => {
    if (!shareCardUrl) return;
    downloadDataUrl(shareCardUrl, `FutureMe-Today-vs-${result.years}Years.png`);
  };

  const handleNativeShare = async () => {
    if (!shareCardUrl) return;

    if (navigator.share) {
      try {
        const blob = await (await fetch(shareCardUrl)).blob();
        const file = new File([blob], `FutureMe-${result.years}Y.png`, {
          type: 'image/png',
        });
        await navigator.share({
          title: `Me Today vs Me In ${result.years} Years`,
          text: `Check out my AI future self projection on FutureMe!`,
          files: [file],
        });
        return;
      } catch (err) {
        console.log('Share canceled or not supported with files:', err);
      }
    }

    // Fallback: Copy or download
    handleDownload();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
      <div className="relative flex max-h-[90vh] w-full max-w-sm flex-col overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-950 p-4 shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-neutral-300" />
            <span className="text-sm font-bold text-white">Shareable Future Card</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Share Card Canvas Preview */}
        <div className="relative flex min-h-[380px] flex-1 items-center justify-center overflow-y-auto rounded-2xl border border-neutral-800/80 bg-neutral-900/60 p-2">
          {isRendering ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <RefreshCw className="h-7 w-7 animate-spin text-neutral-400" />
              <p className="mt-3 text-xs font-semibold text-neutral-300">
                Composing High-Res Comparison Card…
              </p>
            </div>
          ) : shareCardUrl ? (
            <img
              src={shareCardUrl}
              alt="Shareable FutureMe Card"
              className="w-full rounded-xl object-contain shadow-lg"
            />
          ) : (
            <p className="text-xs text-neutral-400">Failed to generate image</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex flex-col gap-2">
          <button
            type="button"
            onClick={handleNativeShare}
            id="share-card-trigger-btn"
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3.5 text-sm font-bold text-neutral-950 shadow-lg shadow-white/10 hover:bg-neutral-100 active:scale-[0.98] transition"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-emerald-600" />
                <span>Downloaded & Ready!</span>
              </>
            ) : (
              <>
                <Share2 className="h-4 w-4" />
                <span>Share My Future</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleDownload}
            id="download-share-card-btn"
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-neutral-800 bg-neutral-900/80 px-5 py-3 text-xs font-semibold text-neutral-300 hover:bg-neutral-800 hover:text-white active:scale-[0.98] transition"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Save Comparison Image (PNG)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
