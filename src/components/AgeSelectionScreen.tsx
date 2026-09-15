import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowLeft, Clock, Check } from 'lucide-react';
import { FutureAge, LifestyleHabits } from '../types';

interface AgeSelectionScreenProps {
  selectedAge: FutureAge;
  onSelectAge: (age: FutureAge) => void;
  habits: LifestyleHabits;
  userImage: string;
  onGenerate: () => void;
  onBack: () => void;
}

interface AgeOptionConfig {
  years: FutureAge;
  title: string;
  badge?: string;
  description: string;
  biologicalNote: string;
}

export const AgeSelectionScreen: React.FC<AgeSelectionScreenProps> = ({
  selectedAge,
  onSelectAge,
  habits,
  userImage,
  onGenerate,
  onBack,
}) => {
  const ageOptions: AgeOptionConfig[] = [
    {
      years: 5,
      title: '5 Years',
      description: 'Subtle maturation and natural radiance refinement.',
      biologicalNote: 'Initial fine expression tone, minimal structural alteration.',
    },
    {
      years: 10,
      title: '10 Years',
      description: 'Definitive character lines and dermal tone progression.',
      biologicalNote: 'Subtle brow and laughter contour adaptation.',
    },
    {
      years: 20,
      title: '20 Years',
      badge: 'Recommended',
      description: 'Comprehensive lifestyle impact and cellular maturation.',
      biologicalNote: 'Cumulative photo-aging, sleep repair, and facial maturity.',
    },
    {
      years: 30,
      title: '30 Years',
      description: 'Distinguished silvering and elder elegance.',
      biologicalNote: 'Deep wisdom lines, collagen remodeling, and dignified maturity.',
    },
  ];

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col justify-between px-4 pb-8 pt-2 sm:px-6">
      <div className="mx-auto w-full max-w-md">
        {/* Header Navigation */}
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-xs font-medium text-neutral-400 hover:text-white transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Habits</span>
          </button>
          <span className="rounded-full border border-neutral-800 bg-neutral-900/60 px-3 py-1 text-xs font-semibold text-neutral-400">
            Final Step
          </span>
        </div>

        {/* Title */}
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Choose projection horizon
          </h2>
          <p className="mt-1 text-sm text-neutral-400">
            Select how far into your future you would like to visualize.
          </p>
        </div>

        {/* Summary Card with User Avatar */}
        <div className="mt-5 flex items-center gap-3.5 rounded-2xl border border-neutral-800 bg-neutral-900/50 p-3">
          <img
            src={userImage}
            alt="Your portrait"
            className="h-12 w-12 rounded-xl object-cover ring-1 ring-white/20"
            crossOrigin="anonymous"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-neutral-200">
              Personalized Lifestyle Profile
            </p>
            <p className="truncate text-[11px] text-neutral-400">
              {habits.exercise} exercise • {habits.sleep.replace('_', ' ')} sleep • {habits.sunExposure} sun
            </p>
          </div>
          <div className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-neutral-300">
            Locked
          </div>
        </div>

        {/* Age Options Grid */}
        <div className="mt-5 space-y-2.5">
          {ageOptions.map((option) => {
            const isSelected = selectedAge === option.years;
            return (
              <button
                key={option.years}
                type="button"
                onClick={() => onSelectAge(option.years)}
                id={`age-option-${option.years}`}
                className={`group relative flex w-full flex-col rounded-2xl border p-4 text-left transition-all ${
                  isSelected
                    ? 'border-white bg-neutral-900 shadow-xl shadow-white/5 ring-1 ring-white/60'
                    : 'border-neutral-800/90 bg-neutral-900/40 hover:border-neutral-700 hover:bg-neutral-900/70 active:scale-[0.99]'
                }`}
              >
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg font-bold tracking-tight text-white">
                      +{option.title}
                    </span>
                    {option.badge && (
                      <span className="rounded-full bg-white text-neutral-950 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide">
                        {option.badge}
                      </span>
                    )}
                  </div>

                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded-full border transition ${
                      isSelected
                        ? 'border-white bg-white text-neutral-950'
                        : 'border-neutral-700 bg-neutral-800/40'
                    }`}
                  >
                    {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                  </div>
                </div>

                <p className="mt-1 text-xs text-neutral-300">
                  {option.description}
                </p>

                <p className="mt-2 text-[11px] text-neutral-500">
                  {option.biologicalNote}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Primary Action Button */}
      <div className="mx-auto mt-6 w-full max-w-md pt-2">
        <button
          onClick={onGenerate}
          id="generate-future-btn"
          className="group relative flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-2xl bg-white px-6 py-4 text-base font-bold text-neutral-950 shadow-xl shadow-white/10 hover:bg-neutral-100 active:scale-[0.98]"
        >
          <Sparkles className="h-5 w-5 text-neutral-900" />
          <span>Generate My Future (+{selectedAge} Years)</span>
        </button>
        <p className="mt-2 text-center text-[11px] text-neutral-500">
          Takes ~3–5 seconds. AI visualization, not a medical prediction.
        </p>
      </div>
    </div>
  );
};
