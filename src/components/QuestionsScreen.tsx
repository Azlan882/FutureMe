import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Cigarette,
  Dumbbell,
  Moon,
  Apple,
  Sun,
  HeartPulse,
  Wine,
  ArrowRight,
  ArrowLeft,
  Check,
} from 'lucide-react';
import { LifestyleHabits } from '../types';

interface QuestionsScreenProps {
  habits: LifestyleHabits;
  onChangeHabit: <K extends keyof LifestyleHabits>(key: K, value: LifestyleHabits[K]) => void;
  onComplete: () => void;
  onBack: () => void;
}

interface QuestionConfig<K extends keyof LifestyleHabits> {
  key: K;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  options: {
    value: LifestyleHabits[K];
    label: string;
    description?: string;
  }[];
}

export const QuestionsScreen: React.FC<QuestionsScreenProps> = ({
  habits,
  onChangeHabit,
  onComplete,
  onBack,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);

  const questions: QuestionConfig<any>[] = [
    {
      key: 'smoking',
      title: 'Do you smoke?',
      subtitle: 'Tobacco and vape exposure influence skin micro-vessels and elasticity over time.',
      icon: <Cigarette className="h-6 w-6 text-neutral-200" />,
      options: [
        { value: 'never', label: 'Never', description: 'Zero smoke exposure' },
        { value: 'occasionally', label: 'Occasionally', description: 'Social or infrequent' },
        { value: 'daily', label: 'Daily', description: 'Regular daily consumption' },
      ],
    },
    {
      key: 'exercise',
      title: 'How often do you exercise?',
      subtitle: 'Physical activity maintains cardiovascular health and facial muscle definition.',
      icon: <Dumbbell className="h-6 w-6 text-neutral-200" />,
      options: [
        { value: 'rarely', label: 'Rarely', description: 'Under 1 time per week' },
        { value: 'sometimes', label: 'Sometimes', description: '1 to 2 times weekly' },
        { value: 'regularly', label: 'Regularly', description: '3+ times every week' },
      ],
    },
    {
      key: 'sleep',
      title: 'How many hours do you usually sleep?',
      subtitle: 'Cellular recovery and overnight collagen synthesis peak during deep sleep.',
      icon: <Moon className="h-6 w-6 text-neutral-200" />,
      options: [
        { value: 'less_than_6', label: 'Less than 6', description: 'Chronic sleep restriction' },
        { value: '6_to_7', label: '6–7', description: 'Average resting window' },
        { value: '8_plus', label: '8+', description: 'Optimal cellular restoration' },
      ],
    },
    {
      key: 'diet',
      title: 'How would you describe your diet?',
      subtitle: 'Antioxidants and wholesome nutrition counter long-term oxidative stress.',
      icon: <Apple className="h-6 w-6 text-neutral-200" />,
      options: [
        { value: 'mostly_unhealthy', label: 'Mostly unhealthy', description: 'High in processed foods' },
        { value: 'mixed', label: 'Mixed', description: 'Balanced combination' },
        { value: 'mostly_healthy', label: 'Mostly healthy', description: 'Rich in whole foods & hydration' },
      ],
    },
    {
      key: 'sunExposure',
      title: 'How much sun exposure do you normally get?',
      subtitle: 'Ultraviolet radiation is one of the primary drivers of dermal photo-aging.',
      icon: <Sun className="h-6 w-6 text-neutral-200" />,
      options: [
        { value: 'low', label: 'Low', description: 'Mostly indoors or heavy sunscreen use' },
        { value: 'moderate', label: 'Moderate', description: 'Normal everyday daylight' },
        { value: 'high', label: 'High', description: 'Frequent outdoor sun exposure' },
      ],
    },
    {
      key: 'stress',
      title: 'How would you describe your stress level?',
      subtitle: 'Cortisol levels and repetitive facial tension shape long-term expression lines.',
      icon: <HeartPulse className="h-6 w-6 text-neutral-200" />,
      options: [
        { value: 'low', label: 'Low', description: 'Calm and steady baseline' },
        { value: 'moderate', label: 'Moderate', description: 'Typical everyday pressures' },
        { value: 'high', label: 'High', description: 'Frequent chronic stress' },
      ],
    },
    {
      key: 'alcohol',
      title: 'Alcohol consumption?',
      subtitle: 'Hydration balance and cellular detoxification vary with intake frequency.',
      icon: <Wine className="h-6 w-6 text-neutral-200" />,
      options: [
        { value: 'never', label: 'Never', description: 'Zero alcohol intake' },
        { value: 'occasionally', label: 'Occasionally', description: 'Moderate or social' },
        { value: 'frequently', label: 'Frequently', description: 'Multiple times per week' },
      ],
    },
  ];

  const currentQ = questions[currentIdx];
  const currentValue = habits[currentQ.key as keyof LifestyleHabits];
  const progressPercent = Math.round(((currentIdx + 1) / questions.length) * 100);

  const handleSelect = (val: any) => {
    onChangeHabit(currentQ.key as keyof LifestyleHabits, val);
    // Smooth auto-advance after brief visual feedback
    setTimeout(() => {
      if (currentIdx < questions.length - 1) {
        setCurrentIdx((prev) => prev + 1);
      } else {
        onComplete();
      }
    }, 220);
  };

  const handlePrevious = () => {
    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1);
    } else {
      onBack();
    }
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col justify-between px-4 pb-8 pt-2 sm:px-6">
      <div className="mx-auto w-full max-w-md">
        {/* Navigation & Progress Header */}
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={handlePrevious}
            className="flex items-center gap-1 text-xs font-medium text-neutral-400 hover:text-white transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back</span>
          </button>

          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Question {currentIdx + 1} of {questions.length}
          </span>
        </div>

        {/* Continuous Progress Bar */}
        <div className="mb-6 h-1.5 w-full overflow-hidden rounded-full bg-neutral-900">
          <motion.div
            className="h-full bg-white transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Animated Question Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQ.key}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            {/* Header Icon & Title */}
            <div>
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-900 shadow-inner">
                {currentQ.icon}
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                {currentQ.title}
              </h2>
              <p className="mt-1 text-sm text-neutral-400">
                {currentQ.subtitle}
              </p>
            </div>

            {/* Options List */}
            <div className="space-y-2.5">
              {currentQ.options.map((option) => {
                const isSelected = currentValue === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    className={`group relative flex w-full items-center justify-between rounded-2xl border p-4 text-left transition-all ${
                      isSelected
                        ? 'border-white bg-neutral-900 shadow-lg shadow-white/5 ring-1 ring-white/60'
                        : 'border-neutral-800/90 bg-neutral-900/40 hover:border-neutral-700 hover:bg-neutral-900/70 active:scale-[0.99]'
                    }`}
                  >
                    <div>
                      <p className={`text-base font-semibold ${isSelected ? 'text-white' : 'text-neutral-200'}`}>
                        {option.label}
                      </p>
                      {option.description && (
                        <p className="text-xs text-neutral-400 mt-0.5">
                          {option.description}
                        </p>
                      )}
                    </div>

                    <div
                      className={`flex h-6 w-6 items-center justify-center rounded-full border transition-all ${
                        isSelected
                          ? 'border-white bg-white text-neutral-950'
                          : 'border-neutral-700 bg-neutral-800/40 group-hover:border-neutral-600'
                      }`}
                    >
                      {isSelected && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer Navigation */}
      <div className="mx-auto mt-6 flex w-full max-w-md items-center justify-between gap-3 pt-2">
        {currentIdx > 0 && (
          <button
            type="button"
            onClick={handlePrevious}
            className="flex items-center gap-1.5 rounded-2xl border border-neutral-800 bg-neutral-900/60 px-5 py-3.5 text-xs font-semibold text-neutral-300 hover:bg-neutral-800 active:scale-95"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Prev</span>
          </button>
        )}

        <button
          type="button"
          onClick={handleNext}
          id="question-next-btn"
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm font-bold text-neutral-950 shadow-lg shadow-white/10 hover:bg-neutral-100 active:scale-[0.98]"
        >
          <span>{currentIdx === questions.length - 1 ? 'Select Future Age' : 'Next Question'}</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
