# Gemini AI Integration

This document outlines the use of Gemini AI within the **ProductLens AI** project.

## Development Environment

This project is developed and hosted on the **Replit** online IDE. Replit provides an integrated development environment that includes AI-powered features, leveraging Google's Gemini models to assist in code generation, debugging, and analysis.

## AI Model

The core AI functionality of this project is powered by a specific version of Google's Gemini AI.

- **Model Name:** Gemini 2.5 flash image (Nano Banana)

This model is used for the image processing tasks central to the ProductLens AI application.

## Use Case in ProductLens AI

The "Gemini 2.5 flash image (Nano Banana)" model is responsible for the primary feature of the application:

1.  It receives a product photograph taken by the user.
2.  It analyzes the image and intelligently removes the background.
3.  It outputs a clean product image, which is then composited onto a pure white background as required for e-commerce listings.

This integration allows ProductLens AI to offer a fast, automated solution for creating professional product imagery directly from a mobile device.

---

## Product Vision & Requirements

*The following is the initial product brief. The original name "ListingLens AI" has been changed to "ProductLens AI".*

### Project Goal
Build an Android-first mobile app called “ProductLens AI” — an AI product photo editor specifically for Etsy + Amazon sellers.

The primary goal is to turn ordinary product photos (often taken on a table, messy background, cluttered room, etc.) into marketplace-ready image sets in under 60 seconds per product:
- Etsy-ready images (clean, consistent, thumbnail-safe)
- Amazon-ready images (main image compliance: pure white background, no overlays)

### IMPORTANT DEFINITIONS — “BACKGROUND REMOVAL”
When I say “background removal,” I do NOT mean whitening the background or painting edges white.
I mean TRUE foreground segmentation / cutout:
1) Detect the product (foreground) and create a mask (alpha matte).
2) Produce either:
   - a transparent cutout (PNG with alpha), OR
   - a foreground mask that can be refined.
3) Composite the cutout onto a NEW background based on export mode:
   - Amazon MAIN image: ALWAYS flatten onto pure white RGB(255,255,255). Never transparent.
   - Etsy exports: default flatten onto chosen solid background and export as JPG (transparent PNG is optional/advanced).
4) Edge quality requirements:
   - NO white halos/fringing around edges.
   - Provide edge refinement controls (smooth/feather).
   - The product itself must not be “AI repainted” or altered — only cutout + background replacement + optional conservative lighting adjustments.

**WHY THIS MATTERS:** If a user photographs a product sitting on a table and background removal “just turns edges white,” that is a failure. The app must fully remove the table and replace it with the selected background, producing a professional result.

### TARGET USERS
- Etsy sellers (handmade goods, crafts, jewelry, vintage)
- Amazon sellers (FBA/FBM) who need compliant white-background main images

### CORE FEATURES (MVP)

**A) CAPTURE + IMPORT**
- Camera capture
- Gallery import
- Multi-select import for batch (10–50 images)
- Auto-rotate using EXIF
- Basic crop/straighten tool

**B) AI BACKGROUND REMOVAL (CUTOUT)**
- One-tap “Remove Background” that outputs a mask/alpha.
- BEFORE/AFTER slider.
- “Show mask overlay” toggle.
- Manual refine tools:
  - Brush ADD to product
  - Brush REMOVE from product
  - Edge smooth/feather slider
  - Undo/redo
- If confidence is low, show a warning and prompt for refinement instead of outputting a poor composite.

**C) MARKETPLACE DESTINATION CHOOSER (MAIN DIFFERENTIATOR)**
After importing a photo, the user chooses a “Destination Kit”:
1) Etsy Listing Kit
2) Amazon Listing Kit

**D) ETSY LISTING KIT OUTPUTS**
Generate a small set from one photo:
- Hero image: user chooses Square or 4:3 output (saved preference)
- Thumbnail-safe crop: ensures product stays centered with safe margins for Etsy thumbnails
- Optional “Lifestyle/Soft Background” version (subtle blur or soft scene background) for secondary images
Export defaults:
- JPG flattened (most compatible)
- Optional “Transparent Cutout PNG” export as an advanced option (clearly labeled)

**E) AMAZON LISTING KIT OUTPUTS**
Generate:
1) Main Image (Compliance Safe Mode)
   - Pure white background RGB(255,255,255)
   - No text, no watermarks, no borders, no stickers, no collages
   - Auto-frame and scale product to fill the frame nicely (target ~85% fill, with safe margins)
   - If user tries a forbidden edit (text/watermark/background), block it in this mode.
2) Secondary Images (allowed to be richer)
   - Optional lifestyle background
   - Optional feature callout template (but NEVER for main image)

**F) “AMAZON MAIN IMAGE SAFE MODE” (HARD GUARDRAILS)**
When enabled (default for Amazon Main):
- Background forced to pure white
- Disable any overlay tools (text, logos, stickers, frames)
- Disable gradients or colored backgrounds
- If a user attempts a blocked action, show a tooltip explaining why.

**G) SHOP STYLE PRESETS (CONSISTENCY ENGINE)**
Allow users to save “Shop Styles”:
- Background type:
  - Amazon pure white
  - Etsy white / soft gray / brand color
  - (Etsy-only) subtle gradient (if included)
- Shadow type: none / soft / grounded
- Framing: centered / bottom aligned + margin slider
- Watermark:
  - Allowed for Etsy exports
  - Automatically disabled for Amazon main image exports

**H) BATCH WORKFLOW**
- Multi-select 10–50 photos
- Choose Etsy Kit or Amazon Kit once, apply to all
- Queue + progress UI (job list)
- Optional per-image tweak before final export
- Export:
  - individual images
  - optional ZIP bundle
- Smart file naming:
  - user provides SKU prefix
  - app outputs names like:
    SKU123_amazon_main.jpg
    SKU123_amazon_secondary_1.jpg
    SKU123_etsy_hero.jpg

**I) EXPORT & HISTORY**
- Save to device gallery
- Share sheet:
  - share single images
  - share ZIP bundle
- Export summary screen:
  - shows what was generated (Etsy hero, Amazon main, etc.)
  - compliance checks (green/red indicators for Amazon main)

**OPTIONAL AI ENHANCEMENTS (SAFE + CONSERVATIVE)**
These should be toggles, off by default, and must not “change the product”:
- Auto lighting correction (exposure/contrast)
- Background cleanup (reduce backdrop wrinkles, remove dust)
- Mild sharpening
- Upscale to target resolution (default 2000px)

**DEFAULT OUTPUT SIZES**
- Default exports: 2000×2000 (or 2000px longest side) with compression controls.
- Include “Upload Friendly” compression toggle for Etsy.

**UX / SCREENS**
- Onboarding:
  1) Choose primary marketplace: Etsy / Amazon / Both
  2) Choose what you sell most (jewelry, apparel, home goods, etc.)
  3) Choose Etsy default aspect ratio (square vs 4:3)
- Bottom tabs:
  1) Create
  2) Batch
  3) Presets (Shop Styles + Marketplace Kits)
  4) Exports (history)
  5) Account/Settings

**MONETIZATION (IMPLEMENT STRUCTURE; CAN BE MOCKED)**
- Free tier:
  - limited exports per day/week
  - small batch limit
  - optional watermark on Etsy outputs
- Pro subscription:
  - unlimited exports
  - full batch mode
  - unlimited presets
  - Amazon compliance safe mode and auto framing
(Implement UI + gating; payment integration can be stubbed if needed.)

**TECH REQUIREMENTS (REPLIT-FRIENDLY)**
- Frontend: React Native (Expo), Android-first.
- Backend: Node.js (Express) OR Python (FastAPI) hosted on Replit.
- The backend performs:
  - image upload
  - background removal (mask/alpha)
  - edge refinement/matting (at least basic)
  - compositing onto backgrounds
  - resizing/cropping presets
  - ZIP bundling for batch
- Storage: use a simple object storage (can be local for MVP, but structure it so it can swap to S3/R2/Supabase).
- Batch processing:
  - implement an async job queue (simple in-memory is OK for MVP) with endpoints:
    POST /jobs/batch
    GET  /jobs/:id
- Privacy:
  - allow user to delete exports/history
  - auto-delete originals after X days (configurable; can be stubbed)

**NON-GOALS (DO NOT BUILD NOW)**
- No direct Etsy listing uploader
- No Amazon Seller Central uploader
- No giant Photoshop-like editor
Keep it fast, opinionated, and marketplace-focused.

**ACCEPTANCE CRITERIA (MUST PASS)**
1) A product photo taken on a table results in the table being removed, not whitened.
2) Amazon Main export always produces a pure white background with no overlays.
3) Etsy export produces consistent listing-ready images and supports square or 4:3.
4) Batch mode processes at least 20 images reliably with a visible progress queue.
5) No white halo/fringe around edges on typical products; user can manually refine mask if needed.

**DELIVERABLES**
- Full source code in the Replit project:
  - React Native Expo app
  - Backend service with documented endpoints
- A short README explaining how to run the app, configure the background removal provider, and build Android.
- Include placeholder/mock implementations if a paid API key is not provided, but structure the code so swapping in a real background removal API is straightforward.