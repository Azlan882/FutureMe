import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, CheckCircle2, ShieldAlert } from 'lucide-react';
import { FutureAge, LifestyleHabits } from '../types';

interface GeneratingScreenProps {
  userImage: string;
  years: FutureAge;
  habits: LifestyleHabits;
}

const MESSAGES = [
  'Creating your future...',
  'Analyzing facial landmarks & identity…',
  'Correlating lifestyle habit factors…',
  'Rendering photorealistic future projection…',
  'Almost ready…',
];

const STEPS = [
  { label: 'Facial landmarks & bone symmetry mapped', key: 'face' },
  { label: 'Habit vectors: Sleep, Sun, Diet & Stress correlated', key: 'lifestyle' },
  { label: 'Cellular dermal projection synthesizing', key: 'cellular' },
  { label: 'Photorealistic age progression rendering', key: 'render' },
];

export const GeneratingScreen: React.FC<GeneratingScreenProps> = ({
  userImage,
  years,
  habits,
}) => {
  const [msgIdx, setMsgIdx] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);

  useEffect(() => {
    const msgInterval = setInterval(() => {
      setMsgIdx((prev) => (prev + 1) % MESSAGES.length);
    }, 1400);

    const stepInterval = setInterval(() => {
      setStepIdx((prev) => (prev < STEPS.length ? prev + 1 : prev));
    }, 900);

    return () => {
      clearInterval(msgInterval);
      clearInterval(stepInterval);
    };
  }, []);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-between px-4 pb-8 pt-6 sm:px-6">
      <div className="mx-auto flex w-full max-w-md flex-col items-center text-center">
        {/* Radar / Scan Container */}
        <div className="relative mt-2 aspect-[4/5] w-full max-w-[260px] overflow-hidden rounded-3xl border border-neutral-700/80 bg-neutral-900 shadow-2xl shadow-black">
          <img
            src={userImage}
            alt="Scanning portrait"
            className="h-full w-full object-cover object-center filter grayscale-[30%] contrast-[1.05]"
            crossOrigin="anonymous"
          />

          {/* Dark futuristic overlay */}
          <div className="absolute inset-0 bg-neutral-950/25 backdrop-blur-[0.5px]" />

          {/* Laser Scanning Line */}
          <motion.div
            className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-white to-transparent shadow-[0_0_15px_#fff]"
            animate={{
              top: ['0%', '100%', '0%'],
            }}
            transition={{
              repeat: Infinity,
              duration: 2.2,
              ease: 'easeInOut',
            }}
          />

          {/* Biometric Scan Target Grid Corners */}
          <div className="pointer-events-none absolute inset-4 border border-white/20">
            <div className="absolute -top-1 -left-1 h-3 w-3 border-t-2 border-l-2 border-white" />
            <div className="absolute -top-1 -right-1 h-3 w-3 border-t-2 border-r-2 border-white" />
            <div className="absolute -bottom-1 -left-1 h-3 w-3 border-b-2 border-l-2 border-white" />
            <div className="absolute -bottom-1 -right-1 h-3 w-3 border-b-2 border-r-2 border-white" />
          </div>

          {/* Biometric Status Badge */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-xl bg-black/70 px-3 py-1.5 backdrop-blur-md">
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-white">
                Biometric Scan
              </span>
            </div>
            <span className="text-[11px] font-bold text-neutral-300">
              +{years}Y
            </span>
          </div>
        </div>

        {/* Dynamic Rotating Message */}
        <div className="mt-8 h-10 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={msgIdx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-xl font-bold tracking-tight text-white"
            >
              {MESSAGES[msgIdx]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Synthesis Step Checklist */}
        <div className="mt-6 w-full space-y-2.5 rounded-2xl border border-neutral-800/80 bg-neutral-900/50 p-4 text-left">
          {STEPS.map((step, idx) => {
            const isDone = idx < stepIdx;
            const isCurrent = idx === stepIdx;
            return (
              <div
                key={step.key}
                className={`flex items-center gap-3 text-xs transition-opacity duration-300 ${
                  isDone
                    ? 'text-white'
                    : isCurrent
                    ? 'text-neutral-300 font-semibold'
                    : 'text-neutral-500 opacity-60'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-400" />
                ) : (
                  <div
                    className={`h-4 w-4 rounded-full border flex-shrink-0 ${
                      isCurrent
                        ? 'border-white border-t-transparent animate-spin'
                        : 'border-neutral-700'
                    }`}
                  />
                )}
                <span className="truncate">{step.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Prominent Disclaimer (Required by instructions) */}
      <div className="mx-auto mt-6 w-full max-w-md pt-2">
        <div className="flex items-center justify-center gap-2 rounded-2xl border border-neutral-800 bg-neutral-900/40 p-3 text-center text-xs text-neutral-400">
          <ShieldAlert className="h-4 w-4 flex-shrink-0 text-neutral-400" />
          <span>Your future self is an AI visualization, not a medical or scientific prediction.</span>
        </div>
      </div>
    </div>
  );
};
