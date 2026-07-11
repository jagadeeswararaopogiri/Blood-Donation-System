/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** API base URL (e.g. `/api` with Vite proxy, or `http://localhost:8080/api`) */
  readonly VITE_API_BASE_URL: string | undefined
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
