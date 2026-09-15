import React, { useState } from 'react';
import { Smartphone, Github, X, CheckCircle2, Download, Terminal, ExternalLink, Copy, Check } from 'lucide-react';

interface ApkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApkModal: React.FC<ApkModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
      <div className="relative flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-950 p-5 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800/80">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-neutral-950">
              <Smartphone className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Android APK via GitHub</h3>
              <p className="text-[11px] text-neutral-400">Automated GitHub Actions CI Pipeline</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="space-y-4 overflow-y-auto py-4 text-xs">
          {/* Status banner */}
          <div className="flex items-start gap-3 rounded-2xl border border-emerald-900/60 bg-emerald-950/30 p-3.5 text-emerald-300">
            <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-emerald-400 mt-0.5" />
            <div>
              <p className="font-semibold text-white">GitHub Actions APK Workflow Ready</p>
              <p className="mt-0.5 text-[11px] text-emerald-400/90 leading-relaxed">
                We configured <code className="rounded bg-black/40 px-1 py-0.5 font-mono text-emerald-200">.github/workflows/build-apk.yml</code> and Capacitor to automatically compile an installable Android APK on every push or manual run.
              </p>
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-3">
            <p className="font-bold text-neutral-200 uppercase tracking-wider text-[10px]">
              How to get your APK file:
            </p>

            {/* Step 1 */}
            <div className="flex gap-3 rounded-2xl border border-neutral-800/80 bg-neutral-900/50 p-3">
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-neutral-800 font-bold text-white text-[11px]">
                1
              </div>
              <div className="flex-1">
                <p className="font-semibold text-white">Export to GitHub</p>
                <p className="mt-0.5 text-neutral-400 leading-relaxed">
                  In Google AI Studio, click the project menu (top right) → select <strong>Export to GitHub</strong> (or push to your repository).
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-3 rounded-2xl border border-neutral-800/80 bg-neutral-900/50 p-3">
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-neutral-800 font-bold text-white text-[11px]">
                2
              </div>
              <div className="flex-1">
                <p className="font-semibold text-white">Open the Actions Tab</p>
                <p className="mt-0.5 text-neutral-400 leading-relaxed">
                  Go to your repository on GitHub and click on the <strong>Actions</strong> tab. You will see the <strong>Build Android APK</strong> workflow running.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-3 rounded-2xl border border-neutral-800/80 bg-neutral-900/50 p-3">
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-neutral-800 font-bold text-white text-[11px]">
                3
              </div>
              <div className="flex-1">
                <p className="font-semibold text-white">Download the APK Artifact</p>
                <p className="mt-0.5 text-neutral-400 leading-relaxed">
                  When the run finishes (~2 minutes), click into the workflow run and download the <strong>FutureMe-Android-APK</strong> artifact containing <code className="rounded bg-black/40 px-1 font-mono text-neutral-300">FutureMe-v1.0.0-debug.apk</code>. Transfer it to your Android device to install!
                </p>
              </div>
            </div>
          </div>

          {/* Local CLI Command alternative */}
          <div className="rounded-2xl border border-neutral-800/80 bg-neutral-900/30 p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-neutral-300 font-semibold">
                <Terminal className="h-3.5 w-3.5" />
                <span>Or Build Locally with Capacitor</span>
              </div>
              <button
                onClick={() => copyText('npm run build && npx cap sync android && cd android && ./gradlew assembleDebug', 'cmd')}
                className="flex items-center gap-1 rounded bg-neutral-800 px-2 py-0.5 text-[10px] text-neutral-300 hover:text-white"
              >
                {copied === 'cmd' ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                <span>{copied === 'cmd' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="mt-2 overflow-x-auto rounded-lg bg-black/60 p-2 font-mono text-[10px] text-neutral-400">
              npm run build{'\n'}
              npx cap sync android{'\n'}
              cd android && ./gradlew assembleDebug
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-neutral-800/80">
          <button
            onClick={onClose}
            className="flex w-full items-center justify-center rounded-2xl bg-white py-3 font-bold text-neutral-950 hover:bg-neutral-100 transition active:scale-[0.98]"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
