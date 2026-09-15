import { LifestyleHabits, FutureAge, VisualImpactFactor } from '../types';

export function calculateImpactFactors(habits: LifestyleHabits, years: FutureAge): VisualImpactFactor[] {
  const factors: VisualImpactFactor[] = [];

  // Sun exposure
  if (habits.sunExposure === 'high') {
    factors.push({
      title: 'Solar & UV Exposure',
      impactLevel: 'high',
      description: `Cumulative UV exposure over ${years} years accelerates photo-aging, contributing to fine surface lines and subtle pigment shifts.`,
      affectedFeature: 'Dermal elasticity & surface radiance',
    });
  } else if (habits.sunExposure === 'moderate') {
    factors.push({
      title: 'Balanced UV Exposure',
      impactLevel: 'moderate',
      description: `Moderate outdoor exposure shows balanced skin aging with natural pigment preservation.`,
      affectedFeature: 'Natural skin barrier',
    });
  } else {
    factors.push({
      title: 'UV Protection Advantage',
      impactLevel: 'beneficial',
      description: `Low UV damage preserves collagen density and helps maintain clear, even-toned skin over ${years} years.`,
      affectedFeature: 'Collagen preservation',
    });
  }

  // Sleep
  if (habits.sleep === 'less_than_6') {
    factors.push({
      title: 'Sleep Deprivation Effect',
      impactLevel: 'high',
      description: `Restricted cellular rest can deepen subtle periorbital shadows (under-eye area) and soften facial recovery tone.`,
      affectedFeature: 'Under-eye tone & facial vibrancy',
    });
  } else if (habits.sleep === '8_plus') {
    factors.push({
      title: 'Cellular Sleep Renewal',
      impactLevel: 'beneficial',
      description: `Optimal 8+ hours nightly sleep fosters human growth hormone release, preserving skin hydration and eye freshness.`,
      affectedFeature: 'Luminosity & tissue recovery',
    });
  }

  // Smoking
  if (habits.smoking === 'daily') {
    factors.push({
      title: 'Oxidative Stress from Smoke',
      impactLevel: 'high',
      description: `Reduced micro-capillary circulation decreases oxygen delivery to dermis, subtly deepening perioral laughter creases.`,
      affectedFeature: 'Perioral fine lines & capillary glow',
    });
  } else if (habits.smoking === 'never') {
    factors.push({
      title: 'Clean Circulation Profile',
      impactLevel: 'beneficial',
      description: `Zero smoke toxicity protects elastin fibers, maintaining natural firmness throughout the midface.`,
      affectedFeature: 'Midface elasticity & tone',
    });
  }

  // Exercise
  if (habits.exercise === 'regularly') {
    factors.push({
      title: 'Cardiovascular Vitality',
      impactLevel: 'beneficial',
      description: `Consistent physical activity boosts nitric oxide and microcirculation, giving your future self a resilient, youthful glow.`,
      affectedFeature: 'Jawline definition & skin tone',
    });
  } else if (habits.exercise === 'rarely') {
    factors.push({
      title: 'Sedentary Muscle Tone',
      impactLevel: 'moderate',
      description: `Lower activity level allows natural softening of cervical and lower facial muscle contours over decades.`,
      affectedFeature: 'Facial contour definition',
    });
  }

  // Diet
  if (habits.diet === 'mostly_healthy') {
    factors.push({
      title: 'Antioxidant Rich Diet',
      impactLevel: 'beneficial',
      description: `High intake of phytonutrients and hydration combats free radicals, minimizing oxidative tissue degradation over ${years} years.`,
      affectedFeature: 'Cellular longevity & skin moisture',
    });
  } else if (habits.diet === 'mostly_unhealthy') {
    factors.push({
      title: 'Glycation & Processing',
      impactLevel: 'moderate',
      description: `Diets high in refined sugars increase advanced glycation end-products (AGEs), slightly stiffening dermal collagen fibers.`,
      affectedFeature: 'Skin suppleness',
    });
  }

  // Stress
  if (habits.stress === 'high') {
    factors.push({
      title: 'Elevated Cortisol Levels',
      impactLevel: 'high',
      description: `Prolonged cortisol elevates inflammatory markers and expression creases around the brow and forehead lines.`,
      affectedFeature: 'Glabellar & forehead character lines',
    });
  } else if (habits.stress === 'low') {
    factors.push({
      title: 'Low Stress Resilience',
      impactLevel: 'beneficial',
      description: `Low baseline tension promotes relaxed facial musculature, keeping expression contours soft and dignified.`,
      affectedFeature: 'Soft brow & peaceful expression',
    });
  }

  return factors.slice(0, 4);
}
