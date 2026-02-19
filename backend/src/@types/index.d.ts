// Global ambient declarations

declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string
    PORT?: string
    JWT_SECRET: string
    JWT_REFRESH_SECRET: string
    FRONTEND_URL?: string
  }
}
