import { Platform } from "react-native";

const primaryLight = "#6200EE";
const primaryDark = "#BB86FC";
const primaryVariant = "#3700B3";

export const Colors = {
  light: {
    text: "#000000",
    textSecondary: "#757575",
    buttonText: "#FFFFFF",
    tabIconDefault: "#687076",
    tabIconSelected: primaryLight,
    link: primaryLight,
    primary: primaryLight,
    primaryVariant: primaryVariant,
    backgroundRoot: "#FFFFFF",
    backgroundDefault: "#F5F5F5",
    backgroundSecondary: "#E0E0E0",
    backgroundTertiary: "#D9D9D9",
    border: "#E0E0E0",
    error: "#B00020",
    success: "#00C853",
    overlay: "rgba(0, 0, 0, 0.5)",
    white: "#FFFFFF",
  },
  dark: {
    text: "#FFFFFF",
    textSecondary: "#B0B0B0",
    buttonText: "#000000",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: primaryDark,
    link: primaryDark,
    primary: primaryDark,
    primaryVariant: "#6200EE",
    backgroundRoot: "#1F2123",
    backgroundDefault: "#2A2C2E",
    backgroundSecondary: "#353739",
    backgroundTertiary: "#404244",
    border: "#404244",
    error: "#CF6679",
    success: "#00E676",
    overlay: "rgba(0, 0, 0, 0.7)",
    white: "#FFFFFF",
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
  inputHeight: 48,
  buttonHeight: 48,
  captureButtonSize: 72,
  captureButtonBorder: 4,
};

export const BorderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  "2xl": 32,
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
