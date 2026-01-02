# ProductLens AI

An AI-powered mobile app that transforms product photos into Amazon-ready images with professional white backgrounds. Capture a photo, and let AI do the rest.

## Features

- **Camera Capture** - Take product photos directly in the app
- **AI Background Removal** - Automatically removes backgrounds using Gemini 2.5 Flash
- **Amazon-Ready Output** - Generates 2000x2000 JPG images with pure white backgrounds
- **One-Tap Save** - Save processed images directly to your device gallery

## Tech Stack

| Layer | Technology |
|-------|------------|
| Mobile App | Expo React Native (SDK 54), React Navigation 7 |
| Backend | Express.js with TypeScript |
| AI | Google Gemini 2.5 Flash Image |
| Image Processing | Sharp.js |

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo Go app on your mobile device (for development)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Gfolborg/ProductLens-AI.git
   cd ProductLens-AI
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   # Required environment variables
   AI_INTEGRATIONS_GEMINI_API_KEY=your_gemini_api_key
   AI_INTEGRATIONS_GEMINI_BASE_URL=https://generativelanguage.googleapis.com
   ```

4. Start the development servers:
   ```bash
   # Start both backend and Expo dev server
   npm run server:dev     # Terminal 1: Express API on port 5000
   npm run expo:dev       # Terminal 2: Metro bundler on port 8081
   ```

5. Scan the QR code with Expo Go to run on your device.

## Usage

1. **Capture** - Point your camera at a product and tap the capture button
2. **Preview** - Review your photo and tap "Process" to remove the background
3. **Save** - View the result and save to your gallery

## Project Structure

```
client/               # Expo React Native app
  components/         # Reusable UI components
  screens/            # CameraScreen, PreviewScreen, ResultScreen
  navigation/         # React Navigation stack
  hooks/              # Custom hooks (useTheme, useScreenOptions)
  lib/                # API client and React Query setup

server/               # Express API
  routes.ts           # API endpoints
  index.ts            # Server setup

shared/               # Shared code between client and server
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/amazon-main` | Process product photo (multipart/form-data) |

## Scripts

```bash
npm run server:dev      # Start Express API server
npm run expo:dev        # Start Metro bundler
npm run lint            # Run ESLint
npm run check:types     # TypeScript type checking
npm run format          # Auto-format with Prettier
```

## Image Processing Pipeline

1. Upload product photo via multipart form
2. Send to Gemini 2.5 Flash with background removal prompt
3. Resize to 2000x2000 pixels with Sharp.js
4. Apply white background compliance (ensures pure #FFFFFF)
5. Output as high-quality JPEG (95% quality)

## License

MIT
