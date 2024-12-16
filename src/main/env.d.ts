/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MODE: 'staging' | 'prod'
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
