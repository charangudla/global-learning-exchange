import { z } from "zod";

export const platformRoleSchema = z.enum(["student", "speaker"]);

export const phoneNumberSchema = z
  .string()
  .trim()
  .regex(/^\+[1-9]\d{7,14}$/, "Use E.164 format, for example +13125550123.");

export const signUpSchema = z.object({
  displayName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().toLowerCase(),
  phoneNumber: phoneNumberSchema,
  password: z.string().min(8).max(128),
  role: platformRoleSchema,
  preferredPlatformLanguage: z.string().trim().min(2).max(16).default("en"),
  preferredSessionLanguage: z.string().trim().min(2).max(16).default("en"),
  countryCode: z.string().trim().length(2).toUpperCase().optional(),
  timeZone: z.string().trim().min(1).default("UTC")
});

export const loginSchema = z.object({
  email: z.string().trim().email().toLowerCase(),
  password: z.string().min(1)
});

export const emailOtpSchema = z.object({
  email: z.string().trim().email().toLowerCase(),
  token: z.string().trim().min(4).max(12),
  phoneNumber: phoneNumberSchema.optional()
});

export const resendEmailOtpSchema = z.object({
  email: z.string().trim().email().toLowerCase(),
  phoneNumber: phoneNumberSchema.optional()
});

export const phoneOtpSchema = z.object({
  email: z.string().trim().email().toLowerCase(),
  phoneNumber: phoneNumberSchema
});

export const verifyPhoneOtpSchema = phoneOtpSchema.extend({
  token: z.string().trim().min(4).max(12)
});
