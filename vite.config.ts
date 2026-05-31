import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      "/api/inbound-chatbot": {
        target: "https://demoprojects.app.n8n.cloud",
        changeOrigin: true,
        secure: true,
        rewrite: () => "/webhook-test/inbound-chatbot",
      },
      "/api/outbound-chatbot": {
        target: "https://n8n.srv1011048.hstgr.cloud",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/outbound-chatbot/, "/webhook/outboundchatbot"),
      },
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
