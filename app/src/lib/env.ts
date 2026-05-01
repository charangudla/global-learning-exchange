import { z } from "zod";

const envSchema = z.object({
  APP_MODE: z.enum(["local", "self_hosted", "managed"]).default("local"),
  AUTH_PROVIDER: z.enum(["local", "supabase", "authjs", "keycloak"]).default("local"),
  EMAIL_VERIFICATION_PROVIDER: z
    .enum(["dev", "smtp", "supabase"])
    .default("dev"),
  PHONE_VERIFICATION_PROVIDER: z.enum(["dev", "twilio"]).default("dev"),
  DEV_VERIFICATION_CODE: z.string().min(4).max(12).default("000000"),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  DATABASE_URL: z.string().optional(),
  TWILIO_ACCOUNT_SID: z.string().optional(),
  TWILIO_AUTH_TOKEN: z.string().optional(),
  TWILIO_VERIFY_SERVICE_SID: z.string().optional(),
  OPENAI_API_KEY: z.string().optional()
});

export const env = envSchema.parse(process.env);

export function isLocalMode() {
  return env.APP_MODE === "local";
}

export function isLocalAuthProvider() {
  return env.AUTH_PROVIDER === "local";
}

export function isDevEmailVerificationProvider() {
  return env.EMAIL_VERIFICATION_PROVIDER === "dev";
}

export function isDevPhoneVerificationProvider() {
  return env.PHONE_VERIFICATION_PROVIDER === "dev";
}

export function hasSupabaseConfig() {
  return Boolean(
    env.NEXT_PUBLIC_SUPABASE_URL && env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export function getSupabaseConfig() {
  if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error(
      "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local."
    );
  }

  return {
    url: env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  };
}

export function hasDatabaseConfig() {
  return Boolean(env.DATABASE_URL);
}

export function getDatabaseUrl() {
  if (!env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured in .env.local.");
  }

  return env.DATABASE_URL;
}

export function hasTwilioVerifyConfig() {
  return Boolean(
    env.TWILIO_ACCOUNT_SID &&
      env.TWILIO_AUTH_TOKEN &&
      env.TWILIO_VERIFY_SERVICE_SID
  );
}
