import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, RefreshCw, AlertCircle } from 'lucide-react';

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (dataUrl: string) => void;
}

export const CameraModal: React.FC<CameraModalProps> = ({ isOpen, onClose, onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    if (!isOpen) {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
      }
      return;
    }

    let activeStream: MediaStream | null = null;
    setIsInitializing(true);
    setError(null);

    navigator.mediaDevices
      ?.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1080 },
          height: { ideal: 1080 },
        },
        audio: false,
      })
      .then((mediaStream) => {
        activeStream = mediaStream;
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
        setIsInitializing(false);
      })
      .catch((err) => {
        console.error('Camera access error:', err);
        setError('Camera permission denied or camera device unavailable. You can upload a photo instead.');
        setIsInitializing(false);
      });

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTakePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 720;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Flip horizontally for natural mirror selfie capture
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
    onCapture(dataUrl);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md">
      <div className="relative flex w-full max-w-sm flex-col overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-950 p-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-3">
          <div className="flex items-center gap-2">
            <Camera className="h-4 w-4 text-neutral-300" />
            <span className="text-sm font-bold text-white">Live Camera Capture</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Video Viewport */}
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900">
          {error ? (
            <div className="flex h-full flex-col items-center justify-center p-6 text-center text-neutral-400">
              <AlertCircle className="mb-3 h-8 w-8 text-amber-500" />
              <p className="text-sm font-medium text-neutral-200">{error}</p>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="h-full w-full object-cover -scale-x-100"
              />

              {/* Centering Oval Frame */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="h-4/5 w-3/5 rounded-[50%] border-2 border-dashed border-white/40 shadow-[0_0_0_9999px_rgba(0,0,0,0.4)]" />
              </div>

              {isInitializing && (
                <div className="absolute inset-0 flex items-center justify-center bg-neutral-950/80">
                  <RefreshCw className="h-6 w-6 animate-spin text-neutral-400" />
                </div>
              )}
            </>
          )}
        </div>

        <p className="mt-3 text-center text-xs text-neutral-400">
          Position your face inside the guide and ensure good front lighting.
        </p>

        {/* Actions */}
        <div className="mt-4 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-5 py-2.5 text-xs font-semibold text-neutral-400 hover:text-white"
          >
            Cancel
          </button>

          {!error && (
            <button
              type="button"
              onClick={handleTakePhoto}
              id="camera-capture-shutter-btn"
              className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-neutral-950 bg-white shadow-lg ring-2 ring-white active:scale-95"
            >
              <div className="h-10 w-10 rounded-full bg-neutral-200 hover:bg-white" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
