import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

let currentDirname: string;
try {
  currentDirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));
} catch {
  currentDirname = process.cwd();
}

async function startServer() {
  const app = express();
  // Support Cloud Run dynamic PORT while preserving AI Studio proxy port
  const PORT = Number(process.env.DEFAULT_APP_PORT) || (process.env.PORT ? Number(process.env.PORT) : 3000);

  // CORS headers for native Android Capacitor clients (origin: https://localhost)
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
      res.sendStatus(204);
      return;
    }
    next();
  });

  // Body parser with 25mb limit for high-res photo uploads
  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ extended: true, limit: '25mb' }));

  // API Health Check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
      timestamp: new Date().toISOString(),
    });
  });

  // Helper to map questionnaire values to descriptive phrases
  const formatHabitAnswers = (habits: any) => {
    const smokingMap: Record<string, string> = {
      never: 'Never smoked (no tobacco exposure)',
      occasionally: 'Occasional smoker (social smoking)',
      daily: 'Daily smoker (regular nicotine exposure)',
    };
    const exerciseMap: Record<string, string> = {
      rarely: 'Rarely exercises (sedentary lifestyle)',
      sometimes: 'Exercises sometimes (moderate weekly activity)',
      regularly: 'Exercises regularly (active cardio and fitness regimen)',
    };
    const sleepMap: Record<string, string> = {
      less_than_6: 'Less than 6 hours per night (chronic sleep deficit)',
      '6_to_7': '6 to 7 hours per night (moderate average sleep)',
      '8_plus': '8+ hours per night (optimal restorative sleep)',
    };
    const dietMap: Record<string, string> = {
      mostly_unhealthy: 'Mostly processed, high-sugar, and unhealthy diet',
      mixed: 'Mixed standard diet',
      mostly_healthy: 'Mostly healthy, whole-food, antioxidant-rich diet',
    };
    const sunMap: Record<string, string> = {
      low: 'Low sun exposure / consistent SPF protection',
      moderate: 'Moderate incidental sun exposure',
      high: 'High sun exposure / frequent outdoor UV exposure with tanning',
    };
    const stressMap: Record<string, string> = {
      low: 'Low daily stress (calm lifestyle)',
      moderate: 'Moderate work/life stress',
      high: 'High chronic stress (elevated cortisol)',
    };
    const alcoholMap: Record<string, string> = {
      never: 'Never drinks alcohol',
      occasionally: 'Drinks alcohol occasionally in moderation',
      frequently: 'Drinks alcohol frequently / regular consumption',
    };

    return {
      smoking: smokingMap[habits?.smoking] || habits?.smoking || 'Never smoked',
      exercise: exerciseMap[habits?.exercise] || habits?.exercise || 'Exercises regularly',
      sleep: sleepMap[habits?.sleep] || habits?.sleep || '6 to 7 hours per night',
      diet: dietMap[habits?.diet] || habits?.diet || 'Mixed balanced diet',
      sunExposure: sunMap[habits?.sunExposure] || habits?.sunExposure || 'Moderate sun exposure',
      stress: stressMap[habits?.stress] || habits?.stress || 'Moderate daily stress',
      alcohol: alcoholMap[habits?.alcohol] || habits?.alcohol || 'Drinks occasionally',
    };
  };

  // AI Image Aging Endpoint
  app.post('/api/generate-future', async (req, res) => {
    console.log('[FutureMe API] Received /api/generate-future request');
    try {
      const { imageBase64, mimeType = 'image/jpeg', habits, years = 20 } = req.body;

      if (!imageBase64) {
        res.status(400).json({ success: false, error: 'Image data is required.' });
        return;
      }

      // Check if Gemini API key exists
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        console.error('[FutureMe API] Missing GEMINI_API_KEY environment variable');
        res.status(500).json({
          success: false,
          error: 'Gemini API key is not configured on the server. Please set GEMINI_API_KEY in your server environment.',
        });
        return;
      }

      // Resolve image: handle data URL, HTTP(S) URL, or plain base64
      let cleanBase64 = '';
      let resolvedMimeType = mimeType;

      if (typeof imageBase64 === 'string' && (imageBase64.startsWith('http://') || imageBase64.startsWith('https://'))) {
        console.log(`[FutureMe API] Fetching reference avatar from URL: ${imageBase64}`);
        const fetchRes = await fetch(imageBase64);
        if (!fetchRes.ok) {
          throw new Error(`Failed to fetch avatar photo: ${fetchRes.statusText}`);
        }
        const arrayBuf = await fetchRes.arrayBuffer();
        cleanBase64 = Buffer.from(arrayBuf).toString('base64');
        const cType = fetchRes.headers.get('content-type');
        if (cType) resolvedMimeType = cType.split(';')[0];
      } else {
        const dataUrlMatch = String(imageBase64).match(/^data:([^;]+);base64,(.+)$/);
        if (dataUrlMatch) {
          resolvedMimeType = dataUrlMatch[1];
          cleanBase64 = dataUrlMatch[2];
        } else {
          cleanBase64 = String(imageBase64).replace(/^data:image\/[a-z]+;base64,/, '');
        }
      }

      const formatted = formatHabitAnswers(habits);

      // Carefully constructed prompt instructing the model to generate the future visualization of the SAME PERSON
      const prompt = `Using the provided photograph as the identity reference, create a realistic photographic visualization of how this same person could look approximately ${years} years in the future.
Preserve the person's recognizable identity, facial structure, ethnicity/skin tone, and general appearance.
Age the person naturally by approximately ${years} years.
Use the provided lifestyle information to influence plausible visual characteristics:
Smoking: ${formatted.smoking}
Exercise: ${formatted.exercise}
Sleep: ${formatted.sleep}
Diet: ${formatted.diet}
Sun exposure: ${formatted.sunExposure}
Stress: ${formatted.stress}
Alcohol: ${formatted.alcohol}
The result must clearly look like the same person at an older age, not a different person.
Keep the result photorealistic and natural.
Do not simply reproduce the original image.
Do not return the input image unchanged.
Do not create a collage.
Return a single generated future portrait.`;

      console.log(`[FutureMe API] Starting Gemini image generation for +${years} years projection...`);

      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      // Prefer currently supported Gemini image generation models
      const modelsToTry = [
        'gemini-3.1-flash-lite-image',
        'gemini-3.1-flash-image',
        'gemini-2.5-flash-image',
      ];

      let generatedImageBase64: string | null = null;
      let usedModel: string | null = null;
      let lastErrorMessage = '';

      for (const model of modelsToTry) {
        try {
          console.log(`[FutureMe API] Attempting generation with model: ${model}...`);
          const response = await ai.models.generateContent({
            model: model,
            contents: {
              parts: [
                {
                  inlineData: {
                    mimeType: resolvedMimeType,
                    data: cleanBase64,
                  },
                },
                {
                  text: prompt,
                },
              ],
            },
          });

          if (response.candidates?.[0]?.content?.parts) {
            for (const part of response.candidates[0].content.parts) {
              if (part.inlineData?.data) {
                // Verify the model did not just spit back the exact same input image
                if (part.inlineData.data === cleanBase64) {
                  console.warn(`[FutureMe API] Model ${model} returned identical input data. Skipping.`);
                  continue;
                }
                const returnMime = part.inlineData.mimeType || 'image/jpeg';
                generatedImageBase64 = `data:${returnMime};base64,${part.inlineData.data}`;
                usedModel = model;
                console.log(`[FutureMe API] Successfully generated future portrait using ${model}! Data length: ${part.inlineData.data.length}`);
                break;
              }
            }
          }

          if (generatedImageBase64) {
            break;
          } else {
            console.warn(`[FutureMe API] Model ${model} did not include an image part in response candidates.`);
          }
        } catch (modelErr: any) {
          lastErrorMessage = modelErr?.message || String(modelErr);
          console.error(`[FutureMe API] Model ${model} failed:`, lastErrorMessage);
        }
      }

      if (generatedImageBase64) {
        res.json({
          success: true,
          mode: 'gemini_ai',
          model: usedModel,
          futureImage: generatedImageBase64,
        });
        return;
      }

      // If we reach here, real AI generation could not complete. Never return the original image.
      console.error('[FutureMe API] All Gemini image models failed to produce a valid future image.');
      
      let clientErrorMessage = "Couldn't generate your future visualization. Please try again.";
      if (lastErrorMessage.includes('Quota exceeded') || lastErrorMessage.includes('429')) {
        clientErrorMessage = "Gemini image generation quota exceeded. A Gemini API key with paid billing enabled is required for image generation.";
      } else if (lastErrorMessage) {
        clientErrorMessage = `Gemini generation error: ${lastErrorMessage.slice(0, 150)}`;
      }

      res.status(502).json({
        success: false,
        error: clientErrorMessage,
        details: lastErrorMessage,
      });
    } catch (error: any) {
      console.error('[FutureMe API] Unhandled server error in /api/generate-future:', error);
      res.status(500).json({
        success: false,
        error: error.message || "Couldn't generate your future visualization. Please try again.",
      });
    }
  });

  // Vite middleware in dev or static files in prod
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`FutureMe server running on port ${PORT}`);
  });
}

startServer();
