import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Upload, Camera, Check, AlertCircle, ArrowRight, UserCheck, RefreshCw } from 'lucide-react';
import { CameraModal } from './CameraModal';
import { SAMPLE_AVATARS, SampleAvatar } from '../data/sampleAvatars';

interface UploadScreenProps {
  selectedImage: string | null;
  onImageSelected: (imageSrc: string) => void;
  onContinue: () => void;
  onBack: () => void;
}

export const UploadScreen: React.FC<UploadScreenProps> = ({
  selectedImage,
  onImageSelected,
  onContinue,
  onBack,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [selectedSampleId, setSelectedSampleId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, or WEBP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        setSelectedSampleId(null);
        onImageSelected(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleSelectSample = (avatar: SampleAvatar) => {
    setSelectedSampleId(avatar.id);
    onImageSelected(avatar.url);
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col justify-between px-4 pb-8 pt-2 sm:px-6">
      <div className="mx-auto w-full max-w-md">
        {/* Step Header */}
        <div className="mb-5 flex items-center justify-between">
          <button
            onClick={onBack}
            className="text-xs font-medium text-neutral-400 hover:text-white transition"
          >
            ← Back
          </button>
          <span className="rounded-full border border-neutral-800 bg-neutral-900/60 px-3 py-1 text-xs font-semibold text-neutral-400">
            Step 1 of 3
          </span>
        </div>

        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Upload your photo
          </h2>
          <p className="mt-1 text-sm text-neutral-400">
            For best results, use a clear, front-facing portrait with natural lighting.
          </p>
        </div>

        {/* Selected Image Preview Mode */}
        {selectedImage ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 flex flex-col items-center"
          >
            <div className="relative aspect-[4/5] w-full max-w-[280px] overflow-hidden rounded-3xl border-2 border-neutral-700 bg-neutral-900 shadow-xl shadow-black/80">
              <img
                src={selectedImage}
                alt="Selected portrait"
                className="h-full w-full object-cover object-center"
                crossOrigin="anonymous"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  Ready
                </span>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-full bg-neutral-800/80 px-3 py-1 text-xs font-medium text-neutral-300 hover:bg-neutral-700 hover:text-white backdrop-blur-md"
                >
                  Change
                </button>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 rounded-xl border border-neutral-800/80 bg-neutral-900/50 px-3.5 py-2 text-xs text-neutral-300">
              <UserCheck className="h-4 w-4 text-emerald-400" />
              <span>Facial framing verified. Ready to project future timeline.</span>
            </div>
          </motion.div>
        ) : (
          /* Dropzone / Upload Box */
          <div className="mt-5 space-y-4">
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`group flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed p-7 text-center transition-all ${
                isDragging
                  ? 'border-white bg-neutral-900/90 scale-[1.01]'
                  : 'border-neutral-800 bg-neutral-900/40 hover:border-neutral-700 hover:bg-neutral-900/70'
              }`}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-800 text-white shadow-inner transition group-hover:scale-105">
                <Upload className="h-6 w-6 text-neutral-200" />
              </div>

              <div className="mt-4 space-y-1">
                <p className="text-sm font-semibold text-white">
                  Tap to upload from device
                </p>
                <p className="text-xs text-neutral-400">
                  PNG, JPG, or WEBP up to 20MB
                </p>
              </div>

              <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-neutral-700/60 bg-neutral-800/60 px-3 py-1 text-[11px] font-medium text-neutral-300">
                <span>Browse files or drag photo here</span>
              </div>
            </div>

            {/* Camera Options */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setIsCameraOpen(true)}
                id="open-live-cam-btn"
                className="flex items-center justify-center gap-2 rounded-2xl border border-neutral-800 bg-neutral-900/60 px-4 py-3 text-xs font-semibold text-white transition hover:border-neutral-700 hover:bg-neutral-800/80 active:scale-95"
              >
                <Camera className="h-4 w-4 text-neutral-300" />
                <span>Live Camera</span>
              </button>

              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                id="take-selfie-btn"
                className="flex items-center justify-center gap-2 rounded-2xl border border-neutral-800 bg-neutral-900/60 px-4 py-3 text-xs font-semibold text-white transition hover:border-neutral-700 hover:bg-neutral-800/80 active:scale-95"
              >
                <Camera className="h-4 w-4 text-neutral-300" />
                <span>Take Selfie</span>
              </button>
            </div>

            {/* Quick Sample Selector */}
            <div className="pt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-neutral-300">Or try with a demo photo:</span>
                <span className="text-[11px] text-neutral-500">Instant test</span>
              </div>

              <div className="mt-2.5 grid grid-cols-4 gap-2">
                {SAMPLE_AVATARS.map((avatar) => {
                  const isSelected = selectedSampleId === avatar.id;
                  return (
                    <button
                      key={avatar.id}
                      type="button"
                      onClick={() => handleSelectSample(avatar)}
                      className={`group relative aspect-square overflow-hidden rounded-xl border text-left transition ${
                        isSelected
                          ? 'border-white ring-2 ring-white/50'
                          : 'border-neutral-800 hover:border-neutral-700'
                      }`}
                    >
                      <img
                        src={avatar.url}
                        alt={avatar.name}
                        className="h-full w-full object-cover transition group-hover:scale-105"
                        crossOrigin="anonymous"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-black/60 px-1 py-0.5 text-center text-[10px] font-medium text-white backdrop-blur-xs">
                        {avatar.name}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Photo Guideline Hint */}
            <div className="flex items-start gap-2.5 rounded-2xl border border-neutral-800/80 bg-neutral-900/30 p-3 text-xs text-neutral-400">
              <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-neutral-300" />
              <p>
                Clear face with neutral expression, no sunglasses, and front-facing lighting ensures the most accurate facial bone structure preservation.
              </p>
            </div>
          </div>
        )}

        {/* Hidden inputs */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="user"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* Primary Action Button */}
      <div className="mx-auto mt-6 w-full max-w-md pt-2">
        <button
          disabled={!selectedImage}
          onClick={onContinue}
          id="upload-continue-btn"
          className={`flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 text-base font-bold transition-all ${
            selectedImage
              ? 'bg-white text-neutral-950 shadow-lg shadow-white/10 hover:bg-neutral-100 active:scale-[0.98]'
              : 'cursor-not-allowed bg-neutral-800 text-neutral-500 opacity-60'
          }`}
        >
          <span>Continue to Habits</span>
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>

      {/* Camera Modal */}
      <CameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={(dataUrl) => {
          setSelectedSampleId(null);
          onImageSelected(dataUrl);
        }}
      />
    </div>
  );
};
