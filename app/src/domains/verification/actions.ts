"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import twilio from "twilio";
import { getDb } from "@/db/client";
import { users, verificationEvents } from "@/db/schema";
import { env } from "@/lib/env";
import { asRoute } from "@/lib/routes";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  emailOtpSchema,
  phoneOtpSchema,
  resendEmailOtpSchema,
  verifyPhoneOtpSchema
} from "@/domains/auth/schemas";
import { getUserByEmail } from "@/domains/auth/actions";

function buildVerifyPath(email: string, phoneNumber?: string, message?: string) {
  const params = new URLSearchParams({ email });

  if (phoneNumber) {
    params.set("phone", phoneNumber);
  }

  if (message) {
    params.set("message", message);
  }

  return `/verify?${params.toString()}`;
}

function buildVerifyErrorPath(email: string, phoneNumber: string | undefined, error: string) {
  const params = new URLSearchParams({ email, error });

  if (phoneNumber) {
    params.set("phone", phoneNumber);
  }

  return `/verify?${params.toString()}`;
}

function getTwilioVerifyClient() {
  if (
    !env.TWILIO_ACCOUNT_SID ||
    !env.TWILIO_AUTH_TOKEN ||
    !env.TWILIO_VERIFY_SERVICE_SID
  ) {
    throw new Error(
      "Twilio Verify is not configured. Add TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_VERIFY_SERVICE_SID."
    );
  }

  return {
    serviceSid: env.TWILIO_VERIFY_SERVICE_SID,
    client: twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN)
  };
}

export async function resendEmailOtpAction(formData: FormData) {
  const parsed = resendEmailOtpSchema.safeParse({
    email: formData.get("email"),
    phoneNumber: formData.get("phoneNumber") || undefined
  });

  if (!parsed.success) {
    redirect(asRoute("/verify?error=Enter%20a%20valid%20email."));
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.resend({
    type: "signup",
    email: parsed.data.email
  });

  if (error) {
    redirect(
      asRoute(
      buildVerifyErrorPath(
        parsed.data.email,
        parsed.data.phoneNumber,
        error.message
      )
      )
    );
  }

  const platformUser = await getUserByEmail(parsed.data.email);

  if (platformUser) {
    await getDb().insert(verificationEvents).values({
      userId: platformUser.id,
      type: "email_otp",
      status: "sent",
      target: parsed.data.email,
      provider: "supabase"
    });
  }

  redirect(
    asRoute(
    buildVerifyPath(
      parsed.data.email,
      parsed.data.phoneNumber,
      "Email verification code sent."
    )
    )
  );
}

export async function verifyEmailOtpAction(formData: FormData) {
  const parsed = emailOtpSchema.safeParse({
    email: formData.get("email"),
    token: formData.get("token"),
    phoneNumber: formData.get("phoneNumber") || undefined
  });

  if (!parsed.success) {
    redirect(asRoute("/verify?error=Enter%20a%20valid%20email%20code."));
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.verifyOtp({
    email: parsed.data.email,
    token: parsed.data.token,
    type: "signup"
  });

  if (error) {
    redirect(
      asRoute(
      buildVerifyErrorPath(
        parsed.data.email,
        parsed.data.phoneNumber,
        error.message
      )
      )
    );
  }

  const db = getDb();
  const now = new Date();
  const platformUser = await getUserByEmail(parsed.data.email);

  if (platformUser) {
    await db
      .update(users)
      .set({ emailVerifiedAt: now, updatedAt: now })
      .where(eq(users.id, platformUser.id));

    await db.insert(verificationEvents).values({
      userId: platformUser.id,
      type: "email_otp",
      status: "verified",
      target: parsed.data.email,
      provider: "supabase",
      verifiedAt: now
    });
  }

  redirect(
    asRoute(
    buildVerifyPath(
      parsed.data.email,
      parsed.data.phoneNumber,
      "Email verified."
    )
    )
  );
}

export async function sendPhoneOtpAction(formData: FormData) {
  const parsed = phoneOtpSchema.safeParse({
    email: formData.get("email"),
    phoneNumber: formData.get("phoneNumber")
  });

  if (!parsed.success) {
    redirect(asRoute("/verify?error=Enter%20a%20valid%20phone%20number."));
  }

  const platformUser = await getUserByEmail(parsed.data.email);

  if (!platformUser) {
    redirect(
      asRoute(
      buildVerifyErrorPath(
        parsed.data.email,
        parsed.data.phoneNumber,
        "Create an account before phone verification."
      )
      )
    );
  }

  const { client, serviceSid } = getTwilioVerifyClient();

  await client.verify.v2
    .services(serviceSid)
    .verifications.create({ to: parsed.data.phoneNumber, channel: "sms" });

  await getDb().insert(verificationEvents).values({
    userId: platformUser.id,
    type: "phone_otp",
    status: "sent",
    target: parsed.data.phoneNumber,
    provider: "twilio_verify"
  });

  redirect(
    asRoute(
    buildVerifyPath(
      parsed.data.email,
      parsed.data.phoneNumber,
      "Phone verification code sent."
    )
    )
  );
}

export async function verifyPhoneOtpAction(formData: FormData) {
  const parsed = verifyPhoneOtpSchema.safeParse({
    email: formData.get("email"),
    phoneNumber: formData.get("phoneNumber"),
    token: formData.get("token")
  });

  if (!parsed.success) {
    redirect(asRoute("/verify?error=Enter%20a%20valid%20phone%20code."));
  }

  const platformUser = await getUserByEmail(parsed.data.email);

  if (!platformUser) {
    redirect(
      asRoute(
      buildVerifyErrorPath(
        parsed.data.email,
        parsed.data.phoneNumber,
        "Create an account before phone verification."
      )
      )
    );
  }

  const { client, serviceSid } = getTwilioVerifyClient();
  const result = await client.verify.v2
    .services(serviceSid)
    .verificationChecks.create({
      to: parsed.data.phoneNumber,
      code: parsed.data.token
    });

  if (result.status !== "approved") {
    redirect(
      asRoute(
      buildVerifyErrorPath(
        parsed.data.email,
        parsed.data.phoneNumber,
        "The phone verification code was not approved."
      )
      )
    );
  }

  const db = getDb();
  const now = new Date();

  await db
    .update(users)
    .set({ phoneVerifiedAt: now, updatedAt: now })
    .where(eq(users.id, platformUser.id));

  await db.insert(verificationEvents).values({
    userId: platformUser.id,
    type: "phone_otp",
    status: "verified",
    target: parsed.data.phoneNumber,
    provider: "twilio_verify",
    providerReference: result.sid,
    verifiedAt: now
  });

  redirect(
    asRoute(
    buildVerifyPath(
      parsed.data.email,
      parsed.data.phoneNumber,
      "Phone verified. You can continue to your dashboard."
    )
    )
  );
}
