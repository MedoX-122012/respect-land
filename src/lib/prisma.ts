import { PrismaClient } from "@prisma/client";
import fs from "node:fs";
import path from "node:path";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

// On Vercel serverless the filesystem is ephemeral and read-mostly, but Prisma
// needs a writable SQLite file. Copy the committed database into /tmp once per
// instance so reads always work and writes survive while the instance is warm.
function tempDbUrl(): string | undefined {
  const envUrl = process.env.DATABASE_URL;
  if (!envUrl?.startsWith("file:") || process.env.VERCEL !== "1") return undefined;

  const candidates = [
    path.join(process.cwd(), "prisma", "dev.db"),
    path.join(process.cwd(), "dev.db"),
  ];
  const committed = candidates.find((p) => fs.existsSync(p));
  if (!committed) return undefined;

  const target = path.join("/tmp", "respect-land.db");
  if (!fs.existsSync(target)) {
    try {
      fs.copyFileSync(committed, target);
    } catch {
      return undefined;
    }
  }
  return `file:${target}`;
}

function createClient(): PrismaClient {
  const url = tempDbUrl();
  return url !== undefined
    ? new PrismaClient({ datasources: { db: { url } } })
    : new PrismaClient();
}

export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
