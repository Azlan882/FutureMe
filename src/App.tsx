import React, { useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { Navbar } from './components/Navbar';
import { WelcomeScreen } from './components/WelcomeScreen';
import { UploadScreen } from './components/UploadScreen';
import { QuestionsScreen } from './components/QuestionsScreen';
import { AgeSelectionScreen } from './components/AgeSelectionScreen';
import { GeneratingScreen } from './components/GeneratingScreen';
import { ResultsScreen } from './components/ResultsScreen';
import { ErrorScreen } from './components/ErrorScreen';
import { FlowStep, FutureAge, LifestyleHabits, GenerationResult } from './types';
import { calculateImpactFactors } from './utils/lifestyleImpacts';

const INITIAL_HABITS: LifestyleHabits = {
  smoking: 'never',
  exercise: 'regularly',
  sleep: '6_to_7',
  diet: 'mixed',
  sunExposure: 'moderate',
  stress: 'moderate',
  alcohol: 'occasionally',
};

// Determine backend API URL (supports both web and native Capacitor on Android)
const getApiBaseUrl = (): string => {
  // 1. If explicitly provided via VITE_API_URL (e.g. injected during APK build or environment)
  if (import.meta.env.VITE_API_URL && typeof import.meta.env.VITE_API_URL === 'string' && import.meta.env.VITE_API_URL.trim() !== '') {
    return import.meta.env.VITE_API_URL.trim().replace(/\/+$/, '');
  }

  // 2. Check if running inside native Android/iOS Capacitor environment via official @capacitor/core API
  try {
    if (Capacitor.isNativePlatform() || Capacitor.getPlatform() === 'android' || Capacitor.getPlatform() === 'ios') {
      return 'https://futureme.m-shahraiz774.workers.dev';
    }
  } catch {
    // ignore
  }

  // 3. Fallback checks for WebView / Capacitor runtime environment
  if (typeof window !== 'undefined') {
    const origin = window.location.origin || '';
    const hostname = window.location.hostname || '';
    const port = window.location.port || '';
    const protocol = window.location.protocol || '';

    // Capacitor on Android serves from https://localhost (with no dev port or 443/80) or capacitor://
    if (
      protocol === 'capacitor:' ||
      protocol === 'ionic:' ||
      origin.startsWith('capacitor://') ||
      origin.startsWith('ionic://') ||
      (hostname === 'localhost' && (!port || port === '80' || port === '443'))
    ) {
      return 'https://futureme.m-shahraiz774.workers.dev';
    }

    // Android WebView user-agent check on localhost
    const ua = navigator.userAgent || '';
    if ((ua.includes('wv') || ua.includes('Android')) && (hostname === 'localhost' || !hostname)) {
      return 'https://futureme.m-shahraiz774.workers.dev';
    }
  }

  // 4. Same-origin relative path for Web (AI Studio preview or production web deployment)
  return '';
};

export default function App() {
  const [step, setStep] = useState<FlowStep>('welcome');
  const [userImage, setUserImage] = useState<string | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [futureImage, setFutureImage] = useState<string | null>(null);
  const [habits, setHabits] = useState<LifestyleHabits>(INITIAL_HABITS);
  const [selectedAge, setSelectedAge] = useState<FutureAge>(20); // 20 years default
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleReset = () => {
    setStep('welcome');
    setUserImage(null);
    setOriginalImage(null);
    setFutureImage(null);
    setHabits(INITIAL_HABITS);
    setSelectedAge(20);
    setResult(null);
    setErrorMessage('');
  };

  const handleHabitChange = <K extends keyof LifestyleHabits>(key: K, value: LifestyleHabits[K]) => {
    setHabits((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleStartGeneration = async () => {
    if (!userImage) return;

    setStep('generating');
    setErrorMessage('');

    // Guaranteed minimum visual scanning animation duration for polished UX
    const minDelayPromise = new Promise((resolve) => setTimeout(resolve, 2500));

    const apiEndpoint = `${getApiBaseUrl()}/api/generate-future`;
    console.log(`[FutureMe Client] Requesting AI image generation from: ${apiEndpoint}`);

    const generatePromise = (async (): Promise<string> => {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: userImage,
          habits,
          years: selectedAge,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.success || !data?.futureImage) {
        const errorDetail =
          data?.error || `Server responded with status ${response.status}: ${response.statusText}`;
        console.error('[FutureMe Client] Gemini API generation error:', errorDetail);
        throw new Error(errorDetail);
      }

      const returnedFutureImage = data.futureImage as string;

      // CRITICAL CHECK: Verify the generated future image is NOT identical to original
      if (returnedFutureImage === userImage) {
        console.error('[FutureMe Client] Returned future image is identical to input image');
        throw new Error('Generated image is identical to the original image. AI projection failed to alter facial features.');
      }

      return returnedFutureImage;
    })();

    try {
      const [_, returnedFutureImage] = await Promise.all([minDelayPromise, generatePromise]);

      const impactFactors = calculateImpactFactors(habits, selectedAge);

      // Explicitly maintain separate states
      setOriginalImage(userImage);
      setFutureImage(returnedFutureImage);

      setResult({
        originalImage: userImage,
        futureImage: returnedFutureImage,
        years: selectedAge,
        habits,
        impactFactors,
        summaryNote: `AI visualization projected for +${selectedAge} years using Gemini image generation model.`,
      });

      setStep('results');
    } catch (err: any) {
      console.error('[FutureMe Client] Generation workflow caught error:', err);
      const msg = err?.message || "Couldn't generate your future visualization. Please try again.";
      setErrorMessage(msg);
      setStep('error');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50 font-sans selection:bg-neutral-800">
      <Navbar currentStep={step} onReset={handleReset} />

      <main className="mx-auto max-w-lg">
        {step === 'welcome' && (
          <WelcomeScreen onStart={() => setStep('upload')} />
        )}

        {step === 'upload' && (
          <UploadScreen
            selectedImage={userImage}
            onImageSelected={(img) => {
              setUserImage(img);
              setOriginalImage(img);
            }}
            onContinue={() => setStep('questions')}
            onBack={() => setStep('welcome')}
          />
        )}

        {step === 'questions' && (
          <QuestionsScreen
            habits={habits}
            onChangeHabit={handleHabitChange}
            onComplete={() => setStep('age')}
            onBack={() => setStep('upload')}
          />
        )}

        {step === 'age' && userImage && (
          <AgeSelectionScreen
            selectedAge={selectedAge}
            onSelectAge={(age) => setSelectedAge(age)}
            habits={habits}
            userImage={userImage}
            onGenerate={handleStartGeneration}
            onBack={() => setStep('questions')}
          />
        )}

        {step === 'generating' && userImage && (
          <GeneratingScreen
            userImage={userImage}
            years={selectedAge}
            habits={habits}
          />
        )}

        {step === 'results' && result && originalImage && futureImage && (
          <ResultsScreen
            result={result}
            onTryAnother={() => setStep('age')}
            onAdjustAge={() => setStep('age')}
          />
        )}

        {step === 'error' && (
          <ErrorScreen
            errorMessage={errorMessage}
            onRetry={handleStartGeneration}
            onBack={() => setStep('age')}
          />
        )}
      </main>
    </div>
  );
}
