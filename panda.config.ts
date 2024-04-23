import { defineConfig } from "@pandacss/dev";
import { aptosPandaPreset } from "@aptos-internal/design-system-web";

export default defineConfig({
  // Disable preflight because @aptos-internal/design-system-web already includes it
  preflight: false,

  // Use the Aptos Panda preset
  presets: [aptosPandaPreset],

  // Additional conditions to be available to our CSS
  conditions: {
    light: "[data-theme=light] &",
    dark: "[data-theme=dark] &",
  },

  // Enable JSX style components.
  jsxFramework: "react",
  jsxStyleProps: "all",

  // Make type checking more strict. TODO: Disabled for now.
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
