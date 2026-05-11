import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const createPrismaClient = (): PrismaClient => {
  if (!process.env.DATABASE_URL) {
    // Return a dummy proxy during the static build phase where DATABASE_URL is absent
    return new Proxy({} as PrismaClient, {
      get() {
        return () => Promise.resolve([]);
      },
    });
  }

  // Prisma 7 requires a driver adapter for PostgreSQL
  // We use a Pool from the 'pg' package for better connection management on Vercel
  const pool = new Pool({ 
    connectionString: process.env.DATABASE_URL,
    max: 10, // Limit connections to prevent pool exhaustion in serverless
  });
  
  const adapter = new PrismaPg(pool);
  
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error"] : ["error"],
  });
};

// Cache globally to prevent connection pool exhaustion (critical for serverless/Vercel)
export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = prisma;
}
