# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

An AI product photo editor mobile app built with Expo React Native. Captures product photos via camera and uses Gemini 2.5 Flash Image to automatically remove backgrounds and create Amazon-ready white background product images (2000x2000 JPG).

**Tech Stack:**
- Frontend: Expo React Native (SDK 54), React Navigation 7
- Backend: Express.js with TypeScript
- AI: Gemini 2.5 Flash Image via Replit AI Integrations
- Image Processing: Sharp.js
- Database: PostgreSQL with Drizzle ORM (configured but not actively used)

## Development Commands

### Running the App
```bash
# Start both server and Expo dev server (recommended for Replit)
# This is the default "Start App" workflow

# OR run individually:
npm run server:dev     # Start Express API server on port 5000
npm run expo:dev       # Start Metro bundler on port 8081
```

### Code Quality
```bash
npm run lint           # Run ESLint
npm run lint:fix       # Fix auto-fixable ESLint issues
npm run check:types    # Run TypeScript type checking (tsc --noEmit)
npm run check:format   # Check Prettier formatting
npm run format         # Auto-format with Prettier
```

### Database
```bash
npm run db:push        # Push schema changes to PostgreSQL (uses Drizzle Kit)
```

### Building for Production
```bash
npm run expo:static:build  # Build static Expo assets
npm run server:build       # Bundle Express server with esbuild
npm run server:prod        # Run production server
```

## Architecture

### Monorepo Structure
```
client/           # Expo React Native app
  components/     # Reusable UI components
  constants/      # Theme (colors, spacing, typography)
  hooks/          # Custom hooks (useTheme, useScreenOptions)
  lib/            # API client and React Query setup
  navigation/     # React Navigation stack
  screens/        # CameraScreen, PreviewScreen, ResultScreen
  App.tsx         # Root component
  index.js        # Entry point (referenced in package.json main field)

server/           # Express API
  replit_integrations/batch/  # Batch processing utilities for Gemini
  routes.ts       # API routes
  index.ts        # Server setup and middleware
  templates/      # Landing page HTML

shared/           # Code shared between client and server
  schema.ts       # Drizzle database schema
```

### Import Aliases
TypeScript and Babel are configured with path aliases:
- `@/*` → `./client/*`
- `@shared/*` → `./shared/*`

Example: `import { useTheme } from "@/hooks/useTheme"`

### API Communication

**Important: Mobile Network Constraints**

Mobile devices on external networks (cellular/different WiFi) cannot reach non-standard HTTPS ports. The app uses Metro's proxy middleware to route API requests:

1. Mobile app requests `https://domain/api/amazon-main` (no port)
2. Replit routes to port 8081 (Metro) via default HTTPS mapping
3. Metro's proxy middleware (`metro.config.js`) intercepts `/api` requests
4. Requests forwarded to Express on `localhost:5000`

**Key files:**
- `metro.config.js` - API proxy configuration using `http-proxy-middleware`
- `client/lib/query-client.ts` - Always strips port from API URLs
- `.replit` - Port mappings (5000 → external 5000, 8081 → external 80)

The `getApiUrl()` function in `client/lib/query-client.ts` deliberately strips the port because mobile devices must use standard HTTPS (443/80).

### Navigation Flow
Stack-only navigation (no tabs):
1. **CameraScreen** - Live camera preview with capture button (root screen)
2. **PreviewScreen** - Review captured photo, trigger AI processing
3. **ResultScreen** - Display processed image with white background, save to gallery

Type definitions in `client/navigation/RootStackNavigator.tsx` define the navigation params.

### API Endpoints

**Server (Express):**
- `GET /api/health` - Health check
- `POST /api/amazon-main` - Process product photo (multipart/form-data, expects `file` field)

**Client API Utilities:**
- `getApiUrl()` - Gets base API URL from `EXPO_PUBLIC_DOMAIN`
- `apiRequest(method, route, data)` - Generic API request helper
- `queryClient` - Configured React Query client with custom fetch behavior

### AI Integration

Uses Replit's Gemini AI integration (no API key management needed):

```typescript
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.AI_INTEGRATIONS_GEMINI_API_KEY,
  httpOptions: {
    apiVersion: "",
    baseUrl: process.env.AI_INTEGRATIONS_GEMINI_BASE_URL,
  },
});
```

**Image Processing Pipeline:**
1. Upload product photo (multipart form)
2. Send to Gemini 2.5 Flash Image with background removal prompt
3. Resize to 2000x2000 with Sharp.js
4. Apply white background compliance guard (converts pixels >= RGB 250,250,250 to pure 255,255,255)
5. Output as JPEG (quality 95)

See `server/routes.ts` for the full implementation.

### Batch Processing Utilities

For batch AI operations, use `server/replit_integrations/batch/utils.ts`:

```typescript
import { batchProcess } from "./replit_integrations/batch";

const results = await batchProcess(
  items,
  async (item) => {
    return await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Process: ${item}`,
    });
  },
  {
    concurrency: 2,        // Max concurrent requests
    retries: 7,            // Retry attempts for rate limits
    onProgress: (completed, total) => console.log(`${completed}/${total}`)
  }
);
```

Includes automatic rate limit handling and exponential backoff.

### Database Schema

Schema defined in `shared/schema.ts` using Drizzle ORM:
- `users` table with id, username, password (not currently used by the app)

Migration workflow:
1. Edit `shared/schema.ts`
2. Run `npm run db:push` to sync with PostgreSQL

**Note:** Database is configured but not actively used in the current MVP. The app is stateless.

### Environment Variables

Required environment variables (set by Replit automatically):
- `AI_INTEGRATIONS_GEMINI_API_KEY` - Gemini API key (from Replit integration)
- `AI_INTEGRATIONS_GEMINI_BASE_URL` - Gemini API base URL
- `DATABASE_URL` - PostgreSQL connection string
- `REPLIT_DEV_DOMAIN` - Replit development domain
- `EXPO_PUBLIC_DOMAIN` - Public domain for API requests (set in npm scripts)
- `PORT` - Server port (defaults to 5000)

### Theme System

Material Design 3 inspired theme in `client/constants/theme.ts`:
- **Primary Color**: #6200EE (Purple)
- **Spacing Scale**: xs(4px), sm(8px), md(16px), lg(24px), xl(32px)
- **Typography**: Roboto font family
- **Components**: Predefined button, card, and text styles

Access via `useTheme()` hook:
```typescript
const theme = useTheme();
const backgroundColor = theme.colors.background;
```

### Server Middleware Stack

Order of middleware in `server/index.ts`:
1. CORS configuration (allows Replit domains)
2. Body parsing (JSON and URL-encoded)
3. Request logging (logs API routes with response time)
4. Expo manifest routing (serves platform-specific manifests)
5. Static file serving (Expo build assets)
6. API routes (via `registerRoutes`)
7. Error handler

**Expo Manifest Logic:**
- Requests to `/` or `/manifest` with `expo-platform` header (ios/android) serve platform-specific manifest
- Otherwise, serves landing page HTML

## Design Guidelines

Detailed design specifications are in `design_guidelines.md`:
- Screen layouts and safe area handling
- Component specifications (buttons, cards, floating camera controls)
- Android-specific considerations
- Accessibility requirements

Key principles:
- Android-first design focus
- Minimal UI with focus on product image
- Material Design 3 aesthetics
- Single-purpose utility app (no authentication needed)

## Important Constraints

1. **No Port Numbers in Mobile API Calls**: The app must work from external mobile networks. Never add port numbers to API URLs in client code.

2. **Gemini Rate Limits**: Use the batch processing utilities when making multiple AI requests. Free tier has strict rate limits.

3. **Image Size Limits**: Multer configured for max 10MB uploads. Sharp processes images in memory - very large images may cause issues.

4. **Database Not Active**: While Drizzle ORM is configured, the current app doesn't persist any data. All operations are stateless.

5. **Expo Go Limitations**: The app runs in Expo Go. Some native modules may not work without a custom development build.
