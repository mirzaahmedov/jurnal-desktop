/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MODE: 'staging' | 'prod' | 'region'
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
