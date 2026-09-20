import React from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, RotateCcw, ArrowLeft, ShieldAlert } from 'lucide-react';

interface ErrorScreenProps {
  errorMessage: string;
  onRetry: () => void;
  onBack: () => void;
}

export const ErrorScreen: React.FC<ErrorScreenProps> = ({
  errorMessage,
  onRetry,
  onBack,
}) => {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-between px-4 pb-8 pt-6 sm:px-6">
      <div className="mx-auto flex w-full max-w-md flex-col items-center text-center">
        {/* Warning Icon Badge */}
        <div className="mt-8 flex h-16 w-16 items-center justify-center rounded-2xl border border-red-500/30 bg-red-500/10 text-red-400 shadow-lg shadow-red-500/10">
          <AlertTriangle className="h-8 w-8" />
        </div>

        <h2 className="mt-6 text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Generation Failed
        </h2>

        <p className="mt-2 text-sm text-neutral-300">
          Couldn't generate your future visualization. Please try again.
        </p>

        {/* Detailed Error Box */}
        <div className="mt-6 w-full rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4 text-left">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
            Details
          </div>
          <div className="mt-1 text-xs text-neutral-300 break-words font-mono">
            {errorMessage}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex w-full flex-col gap-3">
          <button
            onClick={onRetry}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-3.5 text-sm font-bold text-neutral-950 shadow-lg hover:bg-neutral-100 transition active:scale-[0.98]"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Retry Generation</span>
          </button>

          <button
            onClick={onBack}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-neutral-800 bg-neutral-900/80 py-3.5 text-sm font-semibold text-neutral-300 hover:text-white hover:bg-neutral-800 transition active:scale-[0.98]"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Settings</span>
          </button>
        </div>
      </div>

      <div className="mx-auto mt-6 w-full max-w-md pt-2">
        <div className="flex items-center justify-center gap-2 rounded-2xl border border-neutral-800 bg-neutral-900/40 p-3 text-center text-xs text-neutral-400">
          <ShieldAlert className="h-4 w-4 flex-shrink-0 text-neutral-400" />
          <span>Real AI image generation requires an active Gemini service connection.</span>
        </div>
      </div>
    </div>
  );
};
