import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

function retellApiPlugin(env: Record<string, string>): Plugin {
  return {
    name: "retell-api",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url !== "/api/retell/create-web-call" || req.method !== "POST") {
          return next();
        }

        const chunks: Buffer[] = [];
        req.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
        req.on("end", async () => {
          try {
            const apiKey = env.RETELL_API_KEY;
            if (!apiKey) {
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ error: "RETELL_API_KEY is not configured in .env" }));
              return;
            }

            const parsed = JSON.parse(Buffer.concat(chunks).toString("utf-8")) as {
              agent_id?: string;
              retell_llm_dynamic_variables?: Record<string, string>;
              begin_message?: string;
            };

            const agentId = parsed.agent_id || env.VITE_RETELL_AGENT_ID;
            if (!agentId) {
              res.statusCode = 400;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ error: "agent_id is required" }));
              return;
            }

            const retellBody: Record<string, unknown> = {
              agent_id: agentId,
            };

            if (parsed.retell_llm_dynamic_variables) {
              retellBody.retell_llm_dynamic_variables = parsed.retell_llm_dynamic_variables;
            }

            if (parsed.begin_message) {
              retellBody.agent_override = {
                retell_llm: {
                  begin_message: parsed.begin_message,
                  start_speaker: "agent",
                },
              };
            }

            const retellResponse = await fetch("https://api.retellai.com/v2/create-web-call", {
              method: "POST",
              headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(retellBody),
            });

            const responseBody = await retellResponse.text();
            res.statusCode = retellResponse.status;
            res.setHeader("Content-Type", "application/json");
            res.end(responseBody);
          } catch {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: "Failed to create Retell web call" }));
          }
        });
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    server: {
      host: "::",
      port: 8080,
      proxy: {
        "/api/inbound-chatbot": {
          target: "https://nineteen-magazine-emote.ngrok-free.dev",
          changeOrigin: true,
          secure: true,
          rewrite: () => "/webhook/inbound-chatbot",
          configure: (proxy) => {
            proxy.on("proxyReq", (proxyReq) => {
              proxyReq.setHeader("ngrok-skip-browser-warning", "true");
            });
          },
        },
        "/api/outbound-chatbot": {
          target: "https://demoprojects.app.n8n.cloud",
          changeOrigin: true,
          secure: true,
          rewrite: () => "/webhook-test/outbound-chatbot",
        },
      },
    },
    plugins: [
      react(),
      retellApiPlugin(env),
      mode === "development" && componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
