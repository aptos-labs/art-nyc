import { defineConfig, Config } from "@pandacss/dev";
import { aptosPandaPreset } from "@aptos-internal/design-system-web";

const themeExtension: NonNullable<Config["theme"]>["extend"] = {
  semanticTokens: {
    colors: {
      skeleton: {
        DEFAULT: {
          value: {
            base: "{colors.zinc.100}",
            _dark: "{colors.background.secondary}",
          },
        },
        shimmer1: {
          value: {
            base: "rgba(255, 255, 255, 0)",
            _dark: "rgba(64, 64, 64, 0)",
          },
        },
        shimmer2: {
          value: {
            base: "rgba(255, 255, 255, 0.2)",
            _dark: "rgba(64, 64, 64, 0.2)",
          },
        },
        shimmer3: {
          value: {
            base: "rgba(255, 255, 255, 0.5)",
            _dark: "rgba(64, 64, 64, 0.5)",
          },
        },
      },
    },
  },
  keyframes: {
    shimmer: {
      "0%": { transform: "translateX(-100%)" },
      "100%": { transform: "translateX(100%)" },
    },
    expand: {
      "0%": { transform: "scale(0.5)" },
      "100%": { transform: "scale(1.05)" },
    },
  },
};

// We do not enable JSX components.
export default defineConfig({
  // Disable preflight because @aptos-internal/design-system-web already includes it
  preflight: false,

  // Use the Aptos Panda preset
  presets: [aptosPandaPreset],

  theme: { extend: themeExtension },

  // Additional conditions to be available to our CSS
  conditions: {
    light: "[data-theme=light] &",
    dark: "[data-theme=dark] &",
  },

  // Make type checking more strict. For some reason this restricts padding to certain
  // values, e.g. multiples of 4.
  strictTokens: true,
  strictPropertyValues: true,

  // Where to look for your css declarations
  include: ["./src/**/*.{js,jsx,ts,tsx}"],

  // Files to exclude
  exclude: [],

  // The output directory for your css system
  outdir: "styled-system",

  // Enable optimization flags for production builds
  optimize: process.env.NODE_ENV === "production",
  minify: process.env.NODE_ENV === "production",
  hash: process.env.NODE_ENV === "production",
});
