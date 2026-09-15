import React, { useState } from 'react';
import { Sparkles, RotateCcw, Smartphone } from 'lucide-react';
import { FlowStep } from '../types';
import { ApkModal } from './ApkModal';

interface NavbarProps {
  currentStep: FlowStep;
  onReset: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentStep, onReset }) => {
  const [showApkModal, setShowApkModal] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-neutral-800/80 bg-neutral-950/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-md items-center justify-between px-4 sm:px-6">
          <button
            onClick={onReset}
            className="flex items-center gap-2.5 text-left transition hover:opacity-90"
            id="nav-brand-btn"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 text-neutral-950 shadow-sm shadow-white/10">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <span className="font-syne text-lg font-bold tracking-tight text-white">
                FutureMe
              </span>
            </div>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowApkModal(true)}
              id="nav-apk-btn"
              title="Download Android APK via GitHub"
              className="flex items-center gap-1.5 rounded-full border border-neutral-800 bg-neutral-900/90 px-2.5 py-1 text-xs font-semibold text-neutral-300 transition hover:border-neutral-600 hover:text-white active:scale-95"
            >
              <Smartphone className="h-3.5 w-3.5 text-emerald-400" />
              <span>APK</span>
            </button>

            {currentStep !== 'welcome' && (
              <div className="flex items-center gap-2">
                {currentStep === 'results' && (
                  <button
                    onClick={onReset}
                    id="nav-reset-btn"
                    className="flex items-center gap-1.5 rounded-full border border-neutral-800 bg-neutral-900/90 px-3 py-1.5 text-xs font-medium text-neutral-300 transition hover:border-neutral-700 hover:bg-neutral-800 hover:text-white active:scale-95"
                  >
                    <RotateCcw className="h-3 w-3" />
                    <span>New</span>
                  </button>
                )}
                <div className="rounded-full border border-neutral-800/80 bg-neutral-900/60 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                  AI Viz
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <ApkModal isOpen={showApkModal} onClose={() => setShowApkModal(false)} />
    </>
  );
};
