import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import {
  Share2,
  Download,
  RotateCcw,
  Sparkles,
  ShieldAlert,
  SlidersHorizontal,
  Columns2,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { GenerationResult } from '../types';
import { ShareModal } from './ShareModal';
import { downloadDataUrl } from '../utils/generateShareCard';

interface ResultsScreenProps {
  result: GenerationResult;
  onTryAnother: () => void;
  onAdjustAge: () => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({
  result,
  onTryAnother,
  onAdjustAge,
}) => {
  const [viewMode, setViewMode] = useState<'side-by-side' | 'slider'>('side-by-side');
  const [sliderPos, setSliderPos] = useState(50); // percentage 0-100
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const sliderContainerRef = useRef<HTMLDivElement>(null);

  const handleSliderMove = (clientX: number) => {
    if (!sliderContainerRef.current) return;
    const rect = sliderContainerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.round((x / rect.width) * 100);
    setSliderPos(percent);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    handleSliderMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.buttons === 1) {
      handleSliderMove(e.clientX);
    }
  };

  const handleSaveFutureImage = () => {
    downloadDataUrl(result.futureImage, `FutureMe-${result.years}-Years.jpg`);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2200);
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col justify-between px-4 pb-10 pt-2 sm:px-6">
      <div className="mx-auto w-full max-w-md">
        {/* Top bar with View Switcher */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-300">
              Future Projection: +{result.years}Y
            </span>
          </div>

          {/* Segmented View Mode Toggle */}
          <div className="flex rounded-xl border border-neutral-800 bg-neutral-900/80 p-1">
            <button
              onClick={() => setViewMode('side-by-side')}
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold transition ${
                viewMode === 'side-by-side'
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Columns2 className="h-3 w-3" />
              <span>Side by Side</span>
            </button>
            <button
              onClick={() => setViewMode('slider')}
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold transition ${
                viewMode === 'slider'
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <SlidersHorizontal className="h-3 w-3" />
              <span>Split Slider</span>
            </button>
          </div>
        </div>

        {/* COMPARISON VIEWPORT */}
        {viewMode === 'side-by-side' ? (
          /* SIDE BY SIDE MODE: EXACTLY AS REQUESTED */
          <div className="grid grid-cols-2 gap-2.5">
            {/* LEFT: YOU TODAY */}
            <div className="relative aspect-[3/4] overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-900 shadow-xl shadow-black">
              <img
                src={result.originalImage}
                alt="You Today"
                className="h-full w-full object-cover object-center"
                crossOrigin="anonymous"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

              <div className="absolute bottom-3 left-3 right-3 flex flex-col items-start">
                <span className="text-[9px] font-bold uppercase tracking-widest text-neutral-400">
                  Left
                </span>
                <span className="rounded-full bg-black/70 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
                  YOU TODAY
                </span>
              </div>
            </div>

            {/* RIGHT: YOU IN 20 YEARS */}
            <div className="relative aspect-[3/4] overflow-hidden rounded-3xl border-2 border-neutral-700 bg-neutral-900 shadow-xl shadow-black">
              <img
                src={result.futureImage}
                alt={`You in ${result.years} Years`}
                className="h-full w-full object-cover object-center"
                crossOrigin="anonymous"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

              <div className="absolute bottom-3 left-3 right-3 flex flex-col items-start">
                <span className="text-[9px] font-bold uppercase tracking-widest text-neutral-400">
                  Right
                </span>
                <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-neutral-950 backdrop-blur-md">
                  YOU IN {result.years} YEARS
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* INTERACTIVE SPLIT SLIDER MODE */
          <div
            ref={sliderContainerRef}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            onClick={(e) => handleSliderMove(e.clientX)}
            className="group relative aspect-[3/4] w-full cursor-ew-resize select-none overflow-hidden rounded-3xl border border-neutral-700 bg-neutral-900 shadow-2xl shadow-black"
          >
            {/* Future image (Background) */}
            <img
              src={result.futureImage}
              alt={`You in ${result.years} Years`}
              className="absolute inset-0 h-full w-full object-cover object-center"
              crossOrigin="anonymous"
            />
            <div className="absolute bottom-3 right-3 rounded-full bg-white px-3 py-1 text-xs font-bold text-neutral-950 shadow-md backdrop-blur-md">
              YOU IN {result.years} YEARS
            </div>

            {/* Today image (Foreground clipped by slider) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${sliderPos}%` }}
            >
              <img
                src={result.originalImage}
                alt="You Today"
                className="h-full w-full max-w-none object-cover object-center"
                style={{ width: sliderContainerRef.current ? `${sliderContainerRef.current.clientWidth}px` : '100%' }}
                crossOrigin="anonymous"
              />
              <div className="absolute bottom-3 left-3 rounded-full bg-black/70 px-3 py-1 text-xs font-bold text-white backdrop-blur-md">
                YOU TODAY
              </div>
            </div>

            {/* Vertical Divider Line & Handle */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_10px_rgba(0,0,0,0.8)]"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="absolute top-1/2 -left-4 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-neutral-950 shadow-xl ring-2 ring-black/40">
                <SlidersHorizontal className="h-4 w-4" />
              </div>
            </div>
          </div>
        )}

        {/* Required Mandatory Disclaimer */}
        <div className="mt-4 flex items-center justify-center gap-2 rounded-2xl border border-neutral-800/90 bg-neutral-900/40 px-3.5 py-2.5 text-center text-xs text-neutral-400">
          <ShieldAlert className="h-4 w-4 flex-shrink-0 text-neutral-400" />
          <span className="font-medium">
            Your future self is an AI visualization, not a prediction.
          </span>
        </div>

        {/* LIFESTYLE IMPACT INSIGHTS */}
        <div className="mt-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">
              Lifestyle Factors Modeled
            </h3>
            <button
              onClick={onAdjustAge}
              className="flex items-center gap-1 text-xs text-neutral-400 hover:text-white transition"
            >
              <Calendar className="h-3 w-3" />
              <span>Change Age ({result.years}Y)</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {result.impactFactors.map((factor, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-neutral-800/80 bg-neutral-900/50 p-3 text-left"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-200">
                    {factor.title}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      factor.impactLevel === 'beneficial'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : factor.impactLevel === 'high'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : 'bg-neutral-800 text-neutral-300'
                    }`}
                  >
                    {factor.impactLevel}
                  </span>
                </div>
                <p className="mt-1.5 text-[11px] leading-relaxed text-neutral-400">
                  {factor.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CORE ACTION BUTTONS: Exactly as requested */}
      <div className="mx-auto mt-6 flex w-full max-w-md flex-col gap-2.5 pt-2">
        <button
          type="button"
          onClick={() => setIsShareModalOpen(true)}
          id="btn-share-my-future"
          className="group relative flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 text-base font-bold text-neutral-950 shadow-xl shadow-white/10 hover:bg-neutral-100 active:scale-[0.98] transition"
        >
          <Share2 className="h-5 w-5" />
          <span>Share My Future</span>
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleSaveFutureImage}
            id="btn-save-image"
            className="flex items-center justify-center gap-2 rounded-2xl border border-neutral-800 bg-neutral-900/80 px-4 py-3 text-xs font-semibold text-neutral-200 hover:border-neutral-700 hover:bg-neutral-800 active:scale-95 transition"
          >
            {savedSuccess ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>Saved to Photos!</span>
              </>
            ) : (
              <>
                <Download className="h-4 w-4 text-neutral-300" />
                <span>Save Image</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onTryAnother}
            id="btn-try-another-future"
            className="flex items-center justify-center gap-2 rounded-2xl border border-neutral-800 bg-neutral-900/80 px-4 py-3 text-xs font-semibold text-neutral-200 hover:border-neutral-700 hover:bg-neutral-800 active:scale-95 transition"
          >
            <RotateCcw className="h-4 w-4 text-neutral-300" />
            <span>Try Another Future</span>
          </button>
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        result={result}
      />
    </div>
  );
};
