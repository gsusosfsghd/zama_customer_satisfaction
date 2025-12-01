/**
 * Design Tokens for CipherSatisfaction
 * Generated deterministically from seed: 2d772871d0e8dbbc6147295b1cee075f1a6234d86b8bb79a35b7c81d229d140d
 * Based on: CipherSatisfaction + Sepolia + 202412 + CipherSatisfaction.sol
 */

export const designTokens = {
  colors: {
    primary: {
      DEFAULT: "#4A5CFF",
      dark: "#2D3A99",
      light: "#6B7AFF",
    },
    success: {
      DEFAULT: "#10B981",
      dark: "#059669",
      light: "#34D399",
    },
    warning: {
      DEFAULT: "#F59E0B",
      dark: "#D97706",
      light: "#FBBF24",
    },
    error: {
      DEFAULT: "#EF4444",
      dark: "#DC2626",
      light: "#F87171",
    },
    background: {
      light: "#FFFFFF",
      dark: "#0F172A",
    },
    surface: {
      light: "#F8FAFC",
      dark: "#1E293B",
    },
    text: {
      light: "#1E293B",
      dark: "#F1F5F9",
    },
    border: {
      light: "#E2E8F0",
      dark: "#334155",
    },
  },
  typography: {
    fontFamily: {
      sans: ["Inter", "system-ui", "sans-serif"],
    },
    fontSize: {
      display: "3rem", // 48px
      h1: "2.25rem", // 36px
      h2: "1.875rem", // 30px
      h3: "1.5rem", // 24px
      body: "1rem", // 16px
      small: "0.875rem", // 14px
    },
    lineHeight: {
      tight: "1.2",
      normal: "1.5",
    },
    fontWeight: {
      regular: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
    },
  },
  spacing: {
    xs: "0.25rem", // 4px
    sm: "0.5rem", // 8px
    md: "1rem", // 16px
    lg: "1.5rem", // 24px
    xl: "2rem", // 32px
    "2xl": "3rem", // 48px
  },
  borderRadius: {
    sm: "0.375rem", // 6px
    md: "0.5rem", // 8px
    lg: "0.75rem", // 12px
    xl: "1rem", // 16px
  },
  breakpoints: {
    mobile: "768px",
    tablet: "1024px",
    desktop: "1024px",
  },
  transitions: {
    fast: "200ms",
    standard: "300ms",
    slow: "500ms",
    easing: "cubic-bezier(0.4, 0, 0.2, 1)",
  },
} as const;

export type DesignTokens = typeof designTokens;

