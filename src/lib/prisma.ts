import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Prevent initialization during Vercel's static build step where DATABASE_URL is missing
const createPrismaClient = () => {
  if (typeof window === "undefined" && !process.env.DATABASE_URL) {
    // Return a dummy proxy during build to prevent crashes
    return new Proxy({} as PrismaClient, {
      get() {
        return () => Promise.resolve([]);
      }
    });
  }
  try {
    return new PrismaClient({ log: ["query"] });
  } catch (error) {
    console.warn("Failed to initialize PrismaClient during build phase. Using proxy.");
    return new Proxy({} as PrismaClient, {
      get() { return () => Promise.resolve([]); }
    });
  }
};


export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production" && process.env.DATABASE_URL) {
  globalForPrisma.prisma = prisma;
}

