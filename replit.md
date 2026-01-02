# Amazon Photo Editor

## Overview
A mobile-first AI product photo editor built with Expo React Native. The app captures product photos and uses Gemini 2.5 Flash Image to automatically remove backgrounds and create Amazon-ready white background product images (2000x2000 JPG).

## Current State
- MVP complete with camera capture, AI background removal, and gallery save functionality
- Express backend with Gemini AI integration for image processing
- Single-screen workflow: Camera → Preview → Generate → Save

## Tech Stack
- **Frontend**: Expo React Native (SDK 54), React Navigation 7
- **Backend**: Express.js with TypeScript
- **AI**: Gemini 2.5 Flash Image via Replit AI Integrations (no API key required)
- **Image Processing**: Sharp.js for resizing and white background compliance

## Project Structure
```
client/
├── components/     # Reusable UI components (Button, ThemedText, ThemedView, etc.)
├── constants/      # Theme configuration (colors, spacing, typography)
├── hooks/          # Custom hooks (useTheme, useScreenOptions)
├── lib/            # API client and query configuration
├── navigation/     # Navigation stack (RootStackNavigator)
├── screens/        # App screens (CameraScreen, PreviewScreen, ResultScreen)
└── App.tsx         # Root app component

server/
├── replit_integrations/batch/  # Batch processing utilities for AI calls
├── routes.ts       # API endpoints (/api/health, /api/amazon-main)
└── index.ts        # Express server setup

assets/images/      # App icons and splash screens
```

## Key Features
1. **Camera Capture**: Uses expo-camera for live preview and photo capture
2. **Image Picker**: Fallback to gallery selection via expo-image-picker
3. **AI Background Removal**: Gemini 2.5 Flash Image removes backgrounds and places product on pure white
4. **White Compliance Guard**: Post-processing to ensure pure white background (RGB 255,255,255)
5. **Output Specs**: 2000x2000 JPG, product centered at 85% frame fill
6. **Gallery Save**: Uses expo-media-library to save processed images

## API Endpoints
- `GET /api/health` - Health check
- `POST /api/amazon-main` - Process product photo (multipart form, file field)

## User Preferences
- Android-first design focus
- Material Design 3 inspired UI with purple primary color
- No tabs needed - simple stack navigation
- Minimal UI with focus on the product image

## Recent Changes
- Initial MVP build (January 2026)
- Implemented camera capture with expo-camera
- Added Gemini 2.5 Flash Image integration for background removal
- Created white background compliance guard with Sharp.js
- Added save to gallery functionality with expo-media-library
