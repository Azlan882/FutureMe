import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

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

  // AI Image Aging Endpoint
  app.post('/api/generate-future', async (req, res) => {
    try {
      const { imageBase64, mimeType = 'image/jpeg', habits, years = 20 } = req.body;

      if (!imageBase64) {
        res.status(400).json({ error: 'Image base64 data is required' });
        return;
      }

      // Check if Gemini API key exists
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        // Signal to client to proceed with client-side synthesis
        res.json({
          success: true,
          mode: 'client_fallback',
          message: 'No API key configured; using high-fidelity client simulation.',
        });
        return;
      }

      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      // Strip data:image/...;base64, prefix if present
      const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');

      const lifestyleDescription = [
        `Smoking: ${habits?.smoking || 'never'}`,
        `Exercise: ${habits?.exercise || 'regularly'}`,
        `Sleep: ${habits?.sleep || '6_to_7'} hours`,
        `Diet: ${habits?.diet || 'mixed'}`,
        `Sun exposure: ${habits?.sunExposure || 'moderate'}`,
        `Stress level: ${habits?.stress || 'moderate'}`,
        `Alcohol: ${habits?.alcohol || 'occasionally'}`,
      ].join(', ');

      const prompt = `Age progression portrait visualization: Take the person in this photo and generate a realistic, dignified depiction of how they would look approximately ${years} years older.
CRITICAL REQUIREMENTS:
- PRESERVE IDENTITY: Retain exact facial structure, eye color, bone symmetry, gender, and personal resemblance. Do NOT create a different person.
- NATURAL AGING: Add natural mature skin texture, subtle laughter lines around eyes, realistic age-appropriate skin maturation, and natural silvering or mature hair tone for a +${years} year difference.
- LIFESTYLE REFLECTION: Plausibly reflect long-term visual markers corresponding to these habits: ${lifestyleDescription}.
- COMPOSITION: Keep the exact same front-facing portrait framing, pose, and lighting. Avoid cartoonish or exaggerated effects. Maintain clean, high-resolution photorealism.`;

      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.1-flash-lite-image',
          contents: {
            parts: [
              {
                inlineData: {
                  mimeType: mimeType,
                  data: cleanBase64,
                },
              },
              {
                text: prompt,
              },
            ],
          },
        });

        let generatedImageBase64: string | null = null;
        if (response.candidates?.[0]?.content?.parts) {
          for (const part of response.candidates[0].content.parts) {
            if (part.inlineData?.data) {
              generatedImageBase64 = `data:${part.inlineData.mimeType || 'image/jpeg'};base64,${part.inlineData.data}`;
              break;
            }
          }
        }

        if (generatedImageBase64) {
          res.json({
            success: true,
            mode: 'gemini_ai',
            futureImage: generatedImageBase64,
          });
          return;
        }

        // If no image part returned, return fallback instruction
        res.json({
          success: true,
          mode: 'client_fallback',
          message: 'Model did not return image part; using client simulation.',
        });
      } catch (genError: any) {
        console.warn('Gemini image generation attempt notice:', genError?.message || genError);
        // Graceful fallback to client rendering
        res.json({
          success: true,
          mode: 'client_fallback',
          message: 'Falling back to client synthesis due to model availability.',
        });
      }
    } catch (error: any) {
      console.error('API Error in /api/generate-future:', error);
      res.status(500).json({ error: error.message || 'Internal server error' });
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
