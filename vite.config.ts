import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  ssgOptions: {
    // Routes to pre-render at build time
    includedRoutes: (paths: string[]) => {
      // Pre-render static pages
      return [
        '/',
        '/about',
        '/contact',
        '/privacy',
        '/search',
      ];
    },
    // Generate nested directory structure
    dirStyle: 'nested',
    // Script loading
    script: 'async',
  },
}));
