/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GAS_WEBHOOK_URL?: string;
  // добавьте другие переменные окружения здесь, если нужно
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

