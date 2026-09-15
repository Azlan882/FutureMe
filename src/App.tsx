import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { WelcomeScreen } from './components/WelcomeScreen';
import { UploadScreen } from './components/UploadScreen';
import { QuestionsScreen } from './components/QuestionsScreen';
import { AgeSelectionScreen } from './components/AgeSelectionScreen';
import { GeneratingScreen } from './components/GeneratingScreen';
import { ResultsScreen } from './components/ResultsScreen';
import { FlowStep, FutureAge, LifestyleHabits, GenerationResult } from './types';
import { generateClientAgedImage } from './utils/imageAging';
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

export default function App() {
  const [step, setStep] = useState<FlowStep>('welcome');
  const [userImage, setUserImage] = useState<string | null>(null);
  const [habits, setHabits] = useState<LifestyleHabits>(INITIAL_HABITS);
  const [selectedAge, setSelectedAge] = useState<FutureAge>(20); // 20 years default
  const [result, setResult] = useState<GenerationResult | null>(null);

  const handleReset = () => {
    setStep('welcome');
    setUserImage(null);
    setHabits(INITIAL_HABITS);
    setSelectedAge(20);
    setResult(null);
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

    // Run generation with guaranteed minimum visual scan time for smooth UX
    const minDelayPromise = new Promise((resolve) => setTimeout(resolve, 3800));

    const generatePromise = (async (): Promise<string> => {
      try {
        const response = await fetch('/api/generate-future', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64: userImage,
            habits,
            years: selectedAge,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data?.mode === 'gemini_ai' && data?.futureImage) {
            return data.futureImage;
          }
        }
      } catch (err) {
        console.warn('Backend image endpoint notice, falling back to client synthesis:', err);
      }

      // High-fidelity identity-preserving client synthesis
      return await generateClientAgedImage(userImage, selectedAge, habits);
    })();

    try {
      const [_, futureImageUrl] = await Promise.all([minDelayPromise, generatePromise]);

      const impactFactors = calculateImpactFactors(habits, selectedAge);

      setResult({
        originalImage: userImage,
        futureImage: futureImageUrl,
        years: selectedAge,
        habits,
        impactFactors,
        summaryNote: `Visualization projected for ${selectedAge} years with lifestyle factors applied.`,
      });

      setStep('results');
    } catch (err) {
      console.error('Generation failure:', err);
      // Emergency fallback
      try {
        const fallbackUrl = await generateClientAgedImage(userImage, selectedAge, habits);
        setResult({
          originalImage: userImage,
          futureImage: fallbackUrl,
          years: selectedAge,
          habits,
          impactFactors: calculateImpactFactors(habits, selectedAge),
          summaryNote: `Simulation completed.`,
        });
        setStep('results');
      } catch {
        alert('Could not process this image. Please try uploading a different photo.');
        setStep('upload');
      }
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
            onImageSelected={(img) => setUserImage(img)}
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

        {step === 'results' && result && (
          <ResultsScreen
            result={result}
            onTryAnother={() => setStep('age')}
            onAdjustAge={() => setStep('age')}
          />
        )}
      </main>
    </div>
  );
}
