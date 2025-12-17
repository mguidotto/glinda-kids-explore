import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { getAllPaths } from "./scripts/getContentPaths";

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
    // Routes to pre-render at build time - fetches from database
    includedRoutes: async (paths: string[]) => {
      try {
        const dynamicPaths = await getAllPaths();
        console.log(`[SSG] Pre-rendering ${dynamicPaths.length} pages`);
        return dynamicPaths;
      } catch (error) {
        console.error('[SSG] Error getting paths, falling back to static:', error);
        // Fallback to static pages only
        return [
          '/',
          '/about',
          '/contact',
          '/privacy',
          '/search',
        ];
      }
    },
    // Generate nested directory structure
    dirStyle: 'nested',
    // Script loading
    script: 'async',
    // Mock browser globals for SSG
    mock: true,
  },
}));
