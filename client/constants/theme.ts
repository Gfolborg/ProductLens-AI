import { Platform } from "react-native";

// ✨ NEON PLAYGROUND - Energetic & Dynamic Color Palette
// Multi-color system for maximum fun and personality!

// Primary Spectrum (5 vibrant accent colors)
const electric = "#6366F1";    // Indigo - primary actions
const coral = "#FF6B9D";       // Hot pink - success states
const sunset = "#F97316";      // Orange - processing/energy
const emerald = "#10B981";     // Green - completed states
const violet = "#A855F7";      // Purple - batch mode

export const Colors = {
  light: {
    // Core text
    text: "#FFFFFF",                    // Pure white for drama
    textSecondary: "#A1A1AA",           // Zinc 400
    textMuted: "#71717A",               // Zinc 500
    buttonText: "#FFFFFF",

    // Icon colors
    tabIconDefault: "#71717A",
    tabIconSelected: electric,
    link: electric,

    // Primary accent colors (for variety!)
    primary: electric,                   // Main brand color
    electric: electric,                  // Indigo
    coral: coral,                        // Hot pink
    sunset: sunset,                      // Orange
    emerald: emerald,                    // Green
    violet: violet,                      // Purple

    // Gradient Collections (6 total!)
    gradients: {
      // Hero gradient - Purple spectrum
      heroStart: "#6366F1",              // Electric indigo
      heroMiddle: "#8B5CF6",             // Violet
      heroEnd: "#A855F7",                // Purple

      // Success gradient - Emerald to cyan
      successStart: "#10B981",           // Emerald
      successMiddle: "#14B8A6",          // Teal
      successEnd: "#06B6D4",             // Cyan

      // Energy gradient - Sunset burst
      energyStart: "#F97316",            // Orange
      energyMiddle: "#FF6B9D",           // Coral pink
      energyEnd: "#A855F7",              // Violet

      // Rainbow gradient - Full spectrum
      rainbow: ["#EF4444", "#F97316", "#FBBF24", "#10B981", "#06B6D4", "#6366F1", "#A855F7"],

      // Neon gradient - Pure intensity
      neonStart: "#FF00FF",              // Magenta
      neonMiddle: "#00FFFF",             // Cyan
      neonEnd: "#FFFF00",                // Yellow
    },

    // Dramatic backgrounds (deep indigo even in "light" mode!)
    backgroundRoot: "#0F0F23",           // Deep indigo - dramatic base
    backgroundCard: "#1A1A2E",           // Slightly lighter cards
    backgroundDefault: "#14141F",        // Default surfaces
    backgroundSecondary: "#1F1F2D",      // Secondary surfaces
    backgroundTertiary: "#2A2A3B",       // Tertiary surfaces
    backgroundGlass: "rgba(26, 26, 46, 0.8)",  // For glassmorphism

    // Borders
    border: "#2A2A3B",
    borderLight: "#3A3A4B",

    // State colors (vibrant!)
    error: "#FF3B3B",                    // Vibrant red
    errorLight: "#3F1616",               // Dark red background
    success: emerald,                    // Emerald green
    successLight: "#0A4D3C",             // Dark green background
    warning: "#FBBF24",                  // Amber
    warningLight: "#4D3A0F",             // Dark amber background

    // Overlays
    overlay: "rgba(15, 15, 35, 0.7)",
    overlayLight: "rgba(15, 15, 35, 0.5)",
    white: "#FFFFFF",

    // Glassmorphism
    glass: "rgba(26, 26, 46, 0.7)",
    glassBorder: "rgba(255, 255, 255, 0.1)",
    glassHighlight: "rgba(255, 255, 255, 0.05)",

    // Glow effects (NEW!)
    glowElectric: "rgba(99, 102, 241, 0.5)",      // Electric indigo glow
    glowCoral: "rgba(255, 107, 157, 0.5)",        // Coral pink glow
    glowSunset: "rgba(249, 115, 22, 0.5)",        // Orange glow
    glowEmerald: "rgba(16, 185, 129, 0.5)",       // Green glow
    glowViolet: "rgba(168, 85, 247, 0.5)",        // Purple glow

    // Shadows (with color!)
    shadow: "rgba(99, 102, 241, 0.2)",            // Colored shadow
    shadowMedium: "rgba(99, 102, 241, 0.3)",
    shadowStrong: "rgba(99, 102, 241, 0.4)",
  },
  dark: {
    // Core text
    text: "#FFFFFF",
    textSecondary: "#A1A1AA",
    textMuted: "#71717A",
    buttonText: "#0F0F23",               // Dark text on light buttons

    // Icon colors
    tabIconDefault: "#71717A",
    tabIconSelected: "#8B5CF6",          // Lighter violet for dark mode
    link: "#8B5CF6",

    // Primary accent colors
    primary: "#8B5CF6",                  // Lighter for dark mode
    electric: "#818CF8",                 // Lighter indigo
    coral: "#FF7FAC",                    // Lighter coral
    sunset: "#FB923C",                   // Lighter orange
    emerald: "#34D399",                  // Lighter emerald
    violet: "#C084FC",                   // Lighter violet

    // Gradients (lighter versions for dark mode)
    gradients: {
      heroStart: "#818CF8",
      heroMiddle: "#A78BFA",
      heroEnd: "#C084FC",

      successStart: "#34D399",
      successMiddle: "#2DD4BF",
      successEnd: "#22D3EE",

      energyStart: "#FB923C",
      energyMiddle: "#FF7FAC",
      energyEnd: "#C084FC",

      rainbow: ["#F87171", "#FB923C", "#FCD34D", "#34D399", "#22D3EE", "#818CF8", "#C084FC"],

      neonStart: "#FF00FF",
      neonMiddle: "#00FFFF",
      neonEnd: "#FFFF00",
    },

    // Backgrounds (even darker!)
    backgroundRoot: "#070710",           // Nearly black
    backgroundCard: "#0F0F1A",           // Very dark cards
    backgroundDefault: "#0A0A15",
    backgroundSecondary: "#12121D",
    backgroundTertiary: "#1A1A28",
    backgroundGlass: "rgba(15, 15, 26, 0.8)",

    // Borders
    border: "#1A1A28",
    borderLight: "#2A2A3B",

    // State colors
    error: "#FF5C5C",
    errorLight: "#2D0F0F",
    success: "#34D399",
    successLight: "#082F23",
    warning: "#FCD34D",
    warningLight: "#3D2D0A",

    // Overlays
    overlay: "rgba(0, 0, 0, 0.8)",
    overlayLight: "rgba(0, 0, 0, 0.6)",
    white: "#FFFFFF",

    // Glassmorphism
    glass: "rgba(15, 15, 26, 0.7)",
    glassBorder: "rgba(255, 255, 255, 0.08)",
    glassHighlight: "rgba(255, 255, 255, 0.03)",

    // Glow effects
    glowElectric: "rgba(129, 140, 248, 0.4)",
    glowCoral: "rgba(255, 127, 172, 0.4)",
    glowSunset: "rgba(251, 146, 60, 0.4)",
    glowEmerald: "rgba(52, 211, 153, 0.4)",
    glowViolet: "rgba(192, 132, 252, 0.4)",

    // Shadows
    shadow: "rgba(0, 0, 0, 0.4)",
    shadowMedium: "rgba(0, 0, 0, 0.5)",
    shadowStrong: "rgba(0, 0, 0, 0.6)",
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  "2xl": 40,
  "3xl": 48,
  "4xl": 56,
  "5xl": 64,
  inputHeight: 52,
  buttonHeight: 52,
  captureButtonSize: 100,      // 🎯 Enlarged from 80px for more impact!
  captureButtonBorder: 5,
};

// 🌟 Enhanced shadow system with colored options
export const Shadows = {
  none: {
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 8,
  },
  xl: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.24,
    shadowRadius: 24,
    elevation: 12,
  },
  // 🎨 Colored shadows for extra flair!
  electric: {
    shadowColor: "#6366F1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  coral: {
    shadowColor: "#FF6B9D",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  emerald: {
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  sunset: {
    shadowColor: "#F97316",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
};

export const BorderRadius = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 20,
  xl: 28,
  "2xl": 36,
  full: 9999,
};

export const Typography = {
  h1: {
    fontSize: 32,
    fontWeight: "700" as const,
  },
  h2: {
    fontSize: 28,
    fontWeight: "700" as const,
  },
  h3: {
    fontSize: 24,
    fontWeight: "600" as const,
  },
  h4: {
    fontSize: 20,
    fontWeight: "500" as const,
  },
  body: {
    fontSize: 16,
    fontWeight: "400" as const,
  },
  small: {
    fontSize: 14,
    fontWeight: "400" as const,
  },
  caption: {
    fontSize: 12,
    fontWeight: "400" as const,
  },
  link: {
    fontSize: 16,
    fontWeight: "400" as const,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
