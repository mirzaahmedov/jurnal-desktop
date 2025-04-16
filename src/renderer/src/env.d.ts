/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MODE: 'staging' | 'prod' | 'region'
  readonly VITE_DEV_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
