import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, Shield, Clock, HeartHandshake } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col justify-between px-4 pb-8 pt-4 sm:px-6">
      <div className="mx-auto flex w-full max-w-md flex-col items-center text-center">
        {/* Animated Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900/80 px-3.5 py-1.5 text-xs font-medium text-neutral-300 backdrop-blur-sm"
        >
          <Sparkles className="h-3.5 w-3.5 text-neutral-200" />
          <span>Biometric & Lifestyle AI Simulator</span>
        </motion.div>

        {/* Hero Headline */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-6 space-y-3"
        >
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Meet the future version of yourself.
          </h1>
          <p className="mx-auto max-w-sm text-base text-neutral-400">
            See an AI visualization of how you might look 20 years from now based on your current habits.
          </p>
        </motion.div>

        {/* Visual Showcase Card: Before & After Peek */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative mt-8 w-full overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-900/70 p-3 shadow-2xl shadow-black/80"
        >
          <div className="grid grid-cols-2 gap-2">
            {/* Today Sample */}
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-neutral-950">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"
                alt="Me Today preview"
                className="h-full w-full object-cover object-top"
                crossOrigin="anonymous"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <span className="absolute bottom-2.5 left-2.5 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-white backdrop-blur-md">
                Today
              </span>
            </div>

            {/* Future Sample */}
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-neutral-950">
              <img
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80"
                alt="Me in 20 Years preview"
                className="h-full w-full object-cover object-top filter contrast-[1.05]"
                crossOrigin="anonymous"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <span className="absolute bottom-2.5 left-2.5 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-neutral-950 backdrop-blur-md">
                In 20 Years
              </span>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between px-2 text-left">
            <div>
              <p className="text-xs font-semibold text-neutral-200">Identity-Preserving AI</p>
              <p className="text-[11px] text-neutral-500">Sleep • Sun • Diet • Stress</p>
            </div>
            <div className="flex items-center gap-1 rounded-full border border-neutral-800 bg-neutral-950/80 px-2.5 py-1 text-[11px] font-medium text-neutral-300">
              <Clock className="h-3 w-3 text-neutral-400" />
              <span>~30 sec</span>
            </div>
          </div>
        </motion.div>

        {/* Feature Highlights */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-6 grid w-full grid-cols-2 gap-2 text-left"
        >
          <div className="rounded-2xl border border-neutral-800/80 bg-neutral-900/40 p-3">
            <Shield className="h-4 w-4 text-neutral-300" />
            <p className="mt-2 text-xs font-semibold text-neutral-200">100% Private</p>
            <p className="text-[11px] text-neutral-400">Photos processed securely</p>
          </div>
          <div className="rounded-2xl border border-neutral-800/80 bg-neutral-900/40 p-3">
            <HeartHandshake className="h-4 w-4 text-neutral-300" />
            <p className="mt-2 text-xs font-semibold text-neutral-200">Habit-Based</p>
            <p className="text-[11px] text-neutral-400">Reflects your lifestyle</p>
          </div>
        </motion.div>
      </div>

      {/* Primary Action Button */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mx-auto mt-6 w-full max-w-md pt-2"
      >
        <button
          onClick={onStart}
          id="welcome-see-future-btn"
          className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-white px-6 py-4 text-base font-bold text-neutral-950 shadow-lg shadow-white/10 transition-all hover:bg-neutral-100 hover:shadow-white/20 active:scale-[0.98]"
        >
          <span>See My Future</span>
          <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
        </button>
        <p className="mt-3 text-center text-[11px] text-neutral-500">
          AI visualization for exploration purposes. Not a medical or scientific prediction.
        </p>
      </motion.div>
    </div>
  );
};
