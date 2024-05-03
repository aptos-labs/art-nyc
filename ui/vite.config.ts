import {defineConfig} from "vite";
import path from 'path';
import react from "@vitejs/plugin-react";

export default defineConfig(() => {
  return {
    build: {
      outDir: "build",
      sourcemap: true,
    },
    envPrefix: ["VITE_", "REACT_APP_"],
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        'styled-system': path.resolve(__dirname, './styled-system')
      },
    },
  };
});
