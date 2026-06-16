/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_RETELL_AGENT_ID: string;
  readonly VITE_INBOUND_CHATBOT_URL: string;
  readonly VITE_OUTBOUND_CHATBOT_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
