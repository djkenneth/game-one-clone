import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  // @ts-ignore - false positive; datasource is valid per @prisma/config types at runtime
  datasource: {
    url: process.env.DATABASE_URL!,
  },
});
