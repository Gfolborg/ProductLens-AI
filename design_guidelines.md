# AI Product Photo Editor - Design Guidelines

## Application Overview
A focused utility app for Android that transforms product photos into Amazon-ready white background images using AI. Single-purpose, camera-first experience optimized for quick capture-to-export workflow.

## Architecture Decisions

### Authentication
**No Authentication Required**
- This is a single-user utility app with local-only workflow
- No backend account system needed
- No user data persistence beyond local gallery saves
- No profile or settings screen required for MVP

### Navigation Architecture
**Stack-Only Navigation**
- Linear workflow: Camera → Capture → Process → Save
- No tab bar or drawer needed
- Simple back navigation between states
- Modal permission prompts for camera and media library access

## Screen Specifications

### 1. Camera Capture Screen
**Purpose**: Live camera preview and photo capture

**Layout**:
- **Header**: Transparent, overlays camera preview
  - Title: "Amazon Main (Safe Mode)" - centered, white text with subtle drop shadow for readability
  - No navigation buttons (root screen)
  - Top inset: insets.top + Spacing.xl
- **Main Content**: Full-screen camera preview (expo-camera)
  - No scrolling - fixed viewport fills entire screen
  - Camera preview uses full device dimensions
- **Floating Elements**:
  - Capture button: Large circular button centered at bottom
    - Position: 80px from bottom edge
    - Size: 72px diameter circle with white border (4px)
    - Inner fill when pressed
    - Shadow: shadowOffset {width: 0, height: 2}, shadowOpacity: 0.10, shadowRadius: 2
  - Flash toggle: Small icon button in top-right corner (if supported)
  - Gallery picker: Small icon button in bottom-left corner (fallback to expo-image-picker)

**Safe Area**: 
- Bottom: insets.bottom + 80px (for capture button) + Spacing.xl
- Sides: Spacing.md for floating controls

---

### 2. Preview & Generate Screen
**Purpose**: Review captured photo and initiate AI processing

**Layout**:
- **Header**: Standard navigation header (non-transparent)
  - Title: "Preview" - centered
  - Left button: "< Retake" - returns to camera
  - Right button: None
  - Top inset: Spacing.xl (content below header)
- **Main Content**: Scrollable container
  - Product photo preview card:
    - Centered square container (85% screen width)
    - Captured image fills card
    - Light border: 1px, Color.border
    - Spacing.xl padding around card
  - Action button area:
    - Primary button: "Generate Amazon Main" - full-width minus Spacing.xl horizontal margins
    - Button positioned Spacing.lg below preview card
    - Disabled state while processing (with loading spinner)
  - Bottom inset: insets.bottom + Spacing.xl

**Components**:
- Image preview component with aspect ratio maintained
- Primary action button with loading state
- Error message text area (if AI processing fails)

**Safe Area**:
- Top: Spacing.xl (below header)
- Bottom: insets.bottom + Spacing.xl
- Sides: Spacing.xl

---

### 3. Result Screen
**Purpose**: Display AI-processed image and provide save option

**Layout**:
- **Header**: Standard navigation header (non-transparent)
  - Title: "Amazon Ready" - centered
  - Left button: "< Done" - returns to camera for new capture
  - Right button: None
- **Main Content**: Scrollable container
  - Before/After toggle (optional enhancement): Small segmented control at top
  - Result image card:
    - Centered square (85% screen width)
    - Pure white background visible around product
    - Light border: 1px, Color.border
  - Image specs display (small text below image):
    - "2000×2000 • JPG • White Background"
  - Action buttons (stacked vertically, Spacing.md gap):
    - Primary: "Save to Gallery" - full-width minus margins
    - Secondary: "Generate Another" - full-width minus margins

**Components**:
- High-resolution image display component
- Success/error toast notifications
- Primary and secondary button components

**Safe Area**:
- Top: Spacing.xl
- Bottom: insets.bottom + Spacing.xl
- Sides: Spacing.xl

---

## Design System

### Color Palette
**Android Material Design 3 Inspired**
- **Primary**: #6200EE (Purple) - for primary actions, active states
- **Primary Variant**: #3700B3 - for pressed states
- **Background**: #FFFFFF - main background
- **Surface**: #F5F5F5 - cards, elevated surfaces
- **Border**: #E0E0E0 - dividers, card borders
- **Text Primary**: #000000 - main text, titles
- **Text Secondary**: #757575 - helper text, captions
- **Error**: #B00020 - error states, warnings
- **Success**: #00C853 - success confirmations
- **Overlay**: rgba(0, 0, 0, 0.5) - camera overlay elements

### Typography
**Roboto Font Family** (Android default)
- **Header Title**: 20px, Medium weight, Text Primary
- **Button Text**: 16px, Medium weight, White (on primary background)
- **Body**: 14px, Regular, Text Primary
- **Caption**: 12px, Regular, Text Secondary

### Spacing Scale
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px

### Component Specifications

**Primary Button**:
- Height: 48px
- Border radius: 8px
- Background: Primary color
- Text: White, 16px Medium
- Press feedback: Darken to Primary Variant
- Disabled: 40% opacity
- Loading state: Spinner replaces text

**Secondary Button**:
- Same as primary but outlined
- Border: 2px Primary color
- Background: Transparent
- Text: Primary color

**Floating Camera Button**:
- 72px diameter circle
- Border: 4px white
- Background: Semi-transparent white (rgba(255,255,255,0.3))
- Press: Solid white fill
- Shadow: shadowOffset {width: 0, height: 2}, shadowOpacity: 0.10, shadowRadius: 2

**Image Cards**:
- Border radius: 12px
- Border: 1px Border color
- Background: Surface color
- Shadow: None (flat design)

### Icons
- Use @expo/vector-icons (Feather icon set)
- Camera: "camera"
- Gallery: "image"
- Flash: "zap"
- Back/Close: "chevron-left" or "x"
- Success: "check-circle"
- Error: "alert-circle"
- Loading: ActivityIndicator (system spinner)
- Icon size: 24px standard, 20px for compact controls

### Visual Feedback
- All touchable elements use opacity change (activeOpacity: 0.7)
- Buttons use color transitions on press
- Loading states show spinner centered in button
- Success actions trigger brief green toast at bottom
- Errors show red toast with retry option

### Assets Required
**None** - This utility app uses:
- Live camera feed (no placeholder needed)
- System icons from @expo/vector-icons
- User-captured photos only
- Generated white background images (output of AI)

No custom illustrations, logos, or decorative assets needed. The product photo is the content.

### Accessibility
- Minimum touch target: 48x48px (all buttons meet this)
- Camera button extra large at 72px for easy thumb access
- High contrast text (WCAG AA compliant)
- Loading states announced for screen readers
- Permission prompts use clear, plain language
- Error messages specific and actionable

### Android-Specific Considerations
- Use Material Design ripple effect on touchables (default Android behavior)
- System navigation bar color matches app background
- Status bar: Light content on dark camera screen, dark content on white screens
- Handle back button: Return to previous screen or exit app from camera screen
- Request permissions inline with context (camera/gallery)
- Respect system animation scale settings