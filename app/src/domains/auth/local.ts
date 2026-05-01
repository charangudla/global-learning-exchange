import "server-only";

import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { and, eq, gt, isNull } from "drizzle-orm";
import { cookies, headers } from "next/headers";
import { getDb } from "@/db/client";
import {
  localAuthIdentities,
  localAuthSessions,
  users,
  type User
} from "@/db/schema";

const scrypt = promisify(scryptCallback);
const SESSION_COOKIE_NAME = "gle_session";
const SESSION_TTL_DAYS = 30;

function toBase64Url(buffer: Buffer) {
  return buffer.toString("base64url");
}

async function hashToken(token: string) {
  const { createHash } = await import("node:crypto");
  return createHash("sha256").update(token).digest("hex");
}

export async function hashPassword(password: string) {
  const salt = toBase64Url(randomBytes(16));
  const derivedKey = (await scrypt(password, salt, 64)) as Buffer;

  return `scrypt:${salt}:${toBase64Url(derivedKey)}`;
}

export async function verifyPassword(password: string, storedHash: string) {
  const [algorithm, salt, hash] = storedHash.split(":");

  if (algorithm !== "scrypt" || !salt || !hash) {
    return false;
  }

  const derivedKey = (await scrypt(password, salt, 64)) as Buffer;
  const storedKey = Buffer.from(hash, "base64url");

  if (derivedKey.length !== storedKey.length) {
    return false;
  }

  return timingSafeEqual(derivedKey, storedKey);
}

export async function createLocalSession(userId: string) {
  const db = getDb();
  const token = toBase64Url(randomBytes(32));
  const tokenHash = await hashToken(token);
  const expiresAt = new Date(
    Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000
  );
  const requestHeaders = await headers();

  await db.insert(localAuthSessions).values({
    userId,
    tokenHash,
    expiresAt,
    userAgent: requestHeaders.get("user-agent"),
    ipAddress:
      requestHeaders.get("x-forwarded-for") ??
      requestHeaders.get("x-real-ip") ??
      null
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt
  });
}

export async function revokeCurrentLocalSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (token) {
    const tokenHash = await hashToken(token);

    await getDb()
      .update(localAuthSessions)
      .set({ revokedAt: new Date(), updatedAt: new Date() })
      .where(eq(localAuthSessions.tokenHash, tokenHash));
  }

  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getLocalSessionUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  const db = getDb();
  const tokenHash = await hashToken(token);
  const now = new Date();

  const [session] = await db
    .select()
    .from(localAuthSessions)
    .where(
      and(
        eq(localAuthSessions.tokenHash, tokenHash),
        isNull(localAuthSessions.revokedAt),
        gt(localAuthSessions.expiresAt, now)
      )
    )
    .limit(1);

  if (!session) {
    return null;
  }

  const [platformUser] = await db
    .select()
    .from(users)
    .where(eq(users.id, session.userId))
    .limit(1);

  if (!platformUser || platformUser.status !== "active") {
    return null;
  }

  await db
    .update(users)
    .set({ lastActiveAt: now, updatedAt: now })
    .where(eq(users.id, platformUser.id));

  return platformUser;
}

export async function getLocalIdentityByEmail(email: string) {
  const db = getDb();
  const [record] = await db
    .select({
      user: users,
      identity: localAuthIdentities
    })
    .from(users)
    .innerJoin(localAuthIdentities, eq(localAuthIdentities.userId, users.id))
    .where(eq(users.email, email))
    .limit(1);

  return record ?? null;
}
