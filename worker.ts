export interface Env {
  GEMINI_API_KEY?: string;
  ASSETS?: {
    fetch: (request: Request | string, init?: RequestInit) => Promise<Response>;
  };
}

// Helpers for CORS headers supporting Capacitor Android, Cloudflare Worker domain, and localhost
function getCorsHeaders(request: Request): Record<string, string> {
  const origin = request.headers.get('Origin') || '';

  const allowedExact = [
    'https://futureme.m-shahraiz774.workers.dev',
    'https://localhost',
    'capacitor://localhost',
    'http://localhost',
  ];

  let allowOrigin = 'https://futureme.m-shahraiz774.workers.dev';
  if (origin) {
    if (
      allowedExact.includes(origin) ||
      origin.endsWith('.workers.dev') ||
      origin.endsWith('.run.app') ||
      origin.startsWith('http://localhost:') ||
      origin.startsWith('https://localhost:')
    ) {
      allowOrigin = origin;
    }
  }

  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Max-Age': '86400',
  };
}

function formatHabitAnswers(habits: any) {
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
}

export default {
  async fetch(request: Request, env: Env, _ctx: unknown): Promise<Response> {
    const url = new URL(request.url);
    const pathname = url.pathname.replace(/\/+$/, '') || '/';
    const corsHeaders = getCorsHeaders(request);

    // Route 1: API Health Check Endpoint (GET /api/health)
    if (pathname === '/api/health') {
      if (request.method === 'OPTIONS') {
        return new Response(null, {
          status: 204,
          headers: corsHeaders,
        });
      }

      return new Response(
        JSON.stringify({
          status: 'ok',
          runtime: 'cloudflare-worker',
          hasGeminiKey: Boolean(env.GEMINI_API_KEY),
          timestamp: new Date().toISOString(),
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    // Route 2: Future Image Generation Endpoint (POST /api/generate-future)
    if (pathname === '/api/generate-future') {
      if (request.method === 'OPTIONS') {
        return new Response(null, {
          status: 204,
          headers: corsHeaders,
        });
      }
      if (request.method !== 'POST') {
        return new Response(
          JSON.stringify({ success: false, error: 'Method not allowed. Use POST.' }),
          { status: 405, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
      }

      let body: any;
      try {
        body = await request.json();
      } catch {
        return new Response(
          JSON.stringify({ success: false, error: 'Invalid JSON request body.' }),
          { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
      }

      const { imageBase64, mimeType = 'image/jpeg', habits, years = 20 } = body || {};

      if (!imageBase64) {
        return new Response(
          JSON.stringify({ success: false, error: 'Image data is required.' }),
          { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
      }

      const apiKey = env.GEMINI_API_KEY;
      if (!apiKey) {
        return new Response(
          JSON.stringify({
            success: false,
            error:
              'Gemini API key is not configured in Cloudflare Worker environment. Please add it via: npx wrangler secret put GEMINI_API_KEY',
          }),
          { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
      }

      // Resolve image: base64 data URI or remote URL
      let cleanBase64 = '';
      let resolvedMimeType = mimeType;

      if (
        typeof imageBase64 === 'string' &&
        (imageBase64.startsWith('http://') || imageBase64.startsWith('https://'))
      ) {
        const fetchRes = await fetch(imageBase64);
        if (!fetchRes.ok) {
          return new Response(
            JSON.stringify({ success: false, error: `Failed to fetch avatar photo: ${fetchRes.statusText}` }),
            { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
          );
        }
        const arrayBuf = await fetchRes.arrayBuffer();
        const bytes = new Uint8Array(arrayBuf);
        let binary = '';
        const chunkSize = 8192;
        for (let i = 0; i < bytes.length; i += chunkSize) {
          const chunk = bytes.subarray(i, i + chunkSize);
          binary += String.fromCharCode.apply(null, chunk as unknown as number[]);
        }
        cleanBase64 = btoa(binary);
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

      // Supported Gemini image-generation models
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
          const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;

          const geminiRes = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'User-Agent': 'FutureMe-CloudflareWorker/1.0',
            },
            body: JSON.stringify({
              contents: [
                {
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
              ],
            }),
          });

          const geminiData: any = await geminiRes.json().catch(() => null);

          if (!geminiRes.ok) {
            lastErrorMessage = geminiData?.error?.message || `HTTP ${geminiRes.status}: ${geminiRes.statusText}`;
            console.error(`[Cloudflare Worker] Model ${model} returned error:`, lastErrorMessage);
            continue;
          }

          if (geminiData?.candidates?.[0]?.content?.parts) {
            for (const part of geminiData.candidates[0].content.parts) {
              if (part.inlineData?.data) {
                // Ensure model altered the image rather than echoing input
                if (part.inlineData.data === cleanBase64) {
                  console.warn(`[Cloudflare Worker] Model ${model} returned identical input data. Skipping.`);
                  continue;
                }
                const returnMime = part.inlineData.mimeType || 'image/jpeg';
                generatedImageBase64 = `data:${returnMime};base64,${part.inlineData.data}`;
                usedModel = model;
                break;
              }
            }
          }

          if (generatedImageBase64) {
            break;
          }
        } catch (err: any) {
          lastErrorMessage = err?.message || String(err);
          console.error(`[Cloudflare Worker] Fetch to ${model} failed:`, lastErrorMessage);
        }
      }

      if (generatedImageBase64) {
        return new Response(
          JSON.stringify({
            success: true,
            mode: 'gemini_ai',
            model: usedModel,
            futureImage: generatedImageBase64,
          }),
          {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders,
            },
          }
        );
      }

      // Generation failed - provide helpful, secure error message (never expose API key)
      let clientErrorMessage = "Couldn't generate your future visualization. Please try again.";
      if (lastErrorMessage.includes('Quota exceeded') || lastErrorMessage.includes('429')) {
        clientErrorMessage =
          'Gemini image generation quota exceeded. A Gemini API key with paid billing enabled is required for image generation.';
      } else if (lastErrorMessage) {
        const safeError = lastErrorMessage.replace(/key=[a-zA-Z0-9_\-]+/gi, 'key=REDACTED');
        clientErrorMessage = `Gemini generation notice: ${safeError.slice(0, 150)}`;
      }

      return new Response(
        JSON.stringify({
          success: false,
          error: clientErrorMessage,
        }),
        {
          status: 502,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    // 3. Catch-all for unknown /api/ routes
    if (url.pathname.startsWith('/api/')) {
      return new Response(
        JSON.stringify({ success: false, error: 'API route not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // 4. Static frontend asset serving via Cloudflare Assets
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response('FutureMe static asset binding not found', { status: 404 });
  },
};
