import { defineConfig, Config } from "@pandacss/dev";
import { aptosLabsPreset } from "@aptos-internal/design-system-web";

const themeExtension: NonNullable<Config["theme"]>["extend"] = {
  keyframes: {
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
  presets: [aptosLabsPreset],

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
  minify: process.env.NODE_ENV === "production",
  hash: process.env.NODE_ENV === "production",
});
