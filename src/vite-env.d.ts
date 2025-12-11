/// <reference types="vite/client" />

interface ImportMetaEnv {
  // добавьте другие переменные окружения здесь, если нужно
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

