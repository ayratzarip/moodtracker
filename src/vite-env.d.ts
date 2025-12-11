/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  // добавьте другие переменные окружения здесь, если нужно
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

