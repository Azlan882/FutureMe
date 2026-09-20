# FutureMe - Meet Your Future Self (Android & Web)

An AI-powered application visualizing how you might look in the future based on your lifestyle habits (sleep, sun exposure, exercise, diet, stress).

---

## 📱 How to Get the Android APK via GitHub

This repository comes pre-configured with **Capacitor** and an automated **GitHub Actions CI/CD pipeline** (`.github/workflows/build-apk.yml`) that compiles an Android APK automatically.

### Option 1: Automatic Download via GitHub Actions (Zero Setup Required)

1. **Export to GitHub**:
   - In Google AI Studio, click the project menu (three dots in the top right) → select **"Export to GitHub"** (or clone/push this repository to your GitHub account).
2. **Open the Actions Tab**:
   - Navigate to your repository on GitHub (`https://github.com/<your-username>/<repo-name>`).
   - Click the **Actions** tab at the top.
3. **Trigger / View Workflow**:
   - The **"Build Android APK"** workflow runs automatically on every push.
   - You can also manually trigger it anytime by selecting **"Build Android APK"** in the left sidebar and clicking **"Run workflow"**.
4. **Download the APK**:
   - Click on the completed workflow run (takes ~2 minutes).
   - Scroll down to the **Artifacts** section at the bottom.
   - Click **`FutureMe-Android-APK`** to download `FutureMe-v1.0.0-debug.apk`.
   - Transfer the `.apk` to your Android device, allow "Install from Unknown Sources", and launch!

---

### Option 2: Build Locally Using Android Studio / CLI

If you want to build or run the app locally on your machine or Android emulator:

```bash
# 1. Install dependencies
npm install

# 2. Build the web app bundle
npm run build

# 3. Add & sync the Android platform
npx cap add android
npx cap sync android

# 4. Open in Android Studio
npx cap open android

# OR build APK directly via command line
cd android
./gradlew assembleDebug
# The APK will be generated at:
# android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 🏗️ Architecture: Mobile APK → Secure Backend → Gemini API

```text
┌─────────────────────────┐         POST /api/generate-future          ┌─────────────────────────┐
│       FutureMe APK      │ ─────────────────────────────────────────> │   FutureMe Backend      │
│   (Android Capacitor)   │                                            │      (server.ts)        │
│                         │ <───────────────────────────────────────── │                         │
└─────────────────────────┘          Base64 Future Image               └────────────┬────────────┘
                                                                                    │
                                                                   Reads GEMINI_API_KEY from server env
                                                                   (NEVER exposed to mobile APK)
                                                                                    │
                                                                                    ▼
                                                                       ┌─────────────────────────┐
                                                                       │     Google Gemini API   │
                                                                       │   (Image Generation)    │
                                                                       └─────────────────────────┘
```

### Security Guarantee
- **`GEMINI_API_KEY`** is stored **only** in the backend's server environment. It is **never** prefixed with `VITE_`, never embedded in the client APK binary, and never committed to version control.
- **`VITE_API_URL`** is the public HTTP/HTTPS URL of your deployed backend service (e.g. `https://futureme-backend-xyz.a.run.app`). The mobile APK uses this URL to send requests to `POST /api/generate-future`.

---

## 🚀 Simplest Backend Deployment (Google Cloud Run / Render)

The backend (`server.ts`) is pre-bundled and includes a production-ready `Dockerfile`.

### Option A: Google Cloud Run (Recommended - 1 Command)
```bash
# Deploy directly from source to Cloud Run:
gcloud run deploy futureme-backend \
  --source . \
  --port 3000 \
  --set-env-vars GEMINI_API_KEY=your_gemini_api_key_here \
  --allow-unauthenticated
```
Cloud Run will output your live service URL (e.g., `https://futureme-backend-xyz.a.run.app`).

### Option B: Render or Railway
1. Push this repository to GitHub.
2. In Render / Railway, create a new **Web Service** pointing to your repository (Docker runtime).
3. Set the environment variable `GEMINI_API_KEY` in the service settings.
4. Render / Railway will assign a public HTTPS URL (e.g., `https://futureme-backend.onrender.com`).

### Connecting the APK:
1. In your GitHub repository, go to **Settings** → **Secrets and variables** → **Actions**.
2. Add a repository secret named **`VITE_API_URL`** with the value of your backend URL (e.g. `https://futureme-backend-xyz.a.run.app`).
3. Re-run the **"Build Android APK"** GitHub Action to produce an APK wired directly to your secure backend!

---

## ✨ Features

- **Biometric & Lifestyle Questionnaire**: 7 factors modeled (sleep, sun, diet, exercise, stress, smoking, alcohol).
- **Multiple Time Horizons**: 5, 10, 20 (recommended default), and 30-year projections.
- **Side-by-Side & Interactive Split-Slider**: Compare "YOU TODAY" directly with "YOU IN 20 YEARS".
- **Download & Share**: High-resolution branded comparison card ready for Instagram, TikTok, and messaging apps.
- **Camera & Gallery**: Take a selfie with the integrated web camera or upload any portrait.
- **Full Privacy**: 100% secure client-side and server-safe processing.
