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

## ✨ Features

- **Biometric & Lifestyle Questionnaire**: 7 factors modeled (sleep, sun, diet, exercise, stress, smoking, alcohol).
- **Multiple Time Horizons**: 5, 10, 20 (recommended default), and 30-year projections.
- **Side-by-Side & Interactive Split-Slider**: Compare "YOU TODAY" directly with "YOU IN 20 YEARS".
- **Download & Share**: High-resolution branded comparison card ready for Instagram, TikTok, and messaging apps.
- **Camera & Gallery**: Take a selfie with the integrated web camera or upload any portrait.
- **Full Privacy**: 100% secure client-side and server-safe processing.
