var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_url = require("url");
var import_vite = require("vite");
var import_genai = require("@google/genai");
var import_meta = {};
var __filename = (0, import_url.fileURLToPath)(import_meta.url);
var __dirname = import_path.default.dirname(__filename);
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  app.use(import_express.default.json({ limit: "25mb" }));
  app.use(import_express.default.urlencoded({ extended: true, limit: "25mb" }));
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  });
  app.post("/api/generate-future", async (req, res) => {
    try {
      const { imageBase64, mimeType = "image/jpeg", habits, years = 20 } = req.body;
      if (!imageBase64) {
        res.status(400).json({ error: "Image base64 data is required" });
        return;
      }
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        res.json({
          success: true,
          mode: "client_fallback",
          message: "No API key configured; using high-fidelity client simulation."
        });
        return;
      }
      const ai = new import_genai.GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build"
          }
        }
      });
      const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, "");
      const lifestyleDescription = [
        `Smoking: ${habits?.smoking || "never"}`,
        `Exercise: ${habits?.exercise || "regularly"}`,
        `Sleep: ${habits?.sleep || "6_to_7"} hours`,
        `Diet: ${habits?.diet || "mixed"}`,
        `Sun exposure: ${habits?.sunExposure || "moderate"}`,
        `Stress level: ${habits?.stress || "moderate"}`,
        `Alcohol: ${habits?.alcohol || "occasionally"}`
      ].join(", ");
      const prompt = `Age progression portrait visualization: Take the person in this photo and generate a realistic, dignified depiction of how they would look approximately ${years} years older.
CRITICAL REQUIREMENTS:
- PRESERVE IDENTITY: Retain exact facial structure, eye color, bone symmetry, gender, and personal resemblance. Do NOT create a different person.
- NATURAL AGING: Add natural mature skin texture, subtle laughter lines around eyes, realistic age-appropriate skin maturation, and natural silvering or mature hair tone for a +${years} year difference.
- LIFESTYLE REFLECTION: Plausibly reflect long-term visual markers corresponding to these habits: ${lifestyleDescription}.
- COMPOSITION: Keep the exact same front-facing portrait framing, pose, and lighting. Avoid cartoonish or exaggerated effects. Maintain clean, high-resolution photorealism.`;
      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.1-flash-lite-image",
          contents: {
            parts: [
              {
                inlineData: {
                  mimeType,
                  data: cleanBase64
                }
              },
              {
                text: prompt
              }
            ]
          }
        });
        let generatedImageBase64 = null;
        if (response.candidates?.[0]?.content?.parts) {
          for (const part of response.candidates[0].content.parts) {
            if (part.inlineData?.data) {
              generatedImageBase64 = `data:${part.inlineData.mimeType || "image/jpeg"};base64,${part.inlineData.data}`;
              break;
            }
          }
        }
        if (generatedImageBase64) {
          res.json({
            success: true,
            mode: "gemini_ai",
            futureImage: generatedImageBase64
          });
          return;
        }
        res.json({
          success: true,
          mode: "client_fallback",
          message: "Model did not return image part; using client simulation."
        });
      } catch (genError) {
        console.warn("Gemini image generation attempt notice:", genError?.message || genError);
        res.json({
          success: true,
          mode: "client_fallback",
          message: "Falling back to client synthesis due to model availability."
        });
      }
    } catch (error) {
      console.error("API Error in /api/generate-future:", error);
      res.status(500).json({ error: error.message || "Internal server error" });
    }
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`FutureMe server running on port ${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
