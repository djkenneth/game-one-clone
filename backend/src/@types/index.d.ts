// Ambient declarations for packages not yet resolvable with the current installed version.
// These are superseded by the real package types once `bun install` is run.

declare module 'prisma/config' {
  interface PrismaMigrateConfig {
    url: string
  }

  interface PrismaConfig {
    migrate?: PrismaMigrateConfig
  }

  export function defineConfig(config: PrismaConfig): PrismaConfig
}
