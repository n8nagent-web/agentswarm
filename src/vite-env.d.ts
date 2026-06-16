/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_RETELL_AGENT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
