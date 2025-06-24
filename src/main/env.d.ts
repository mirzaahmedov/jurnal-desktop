/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MODE: 'staging' | 'prod' | 'region'
  readonly DEMO: boolean
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
