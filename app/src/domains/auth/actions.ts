"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { getDb } from "@/db/client";
import {
  localAuthIdentities,
  speakerProfiles,
  studentProfiles,
  userRoles,
  users,
  verificationEvents
} from "@/db/schema";
import { isLocalAuthProvider } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { asRoute } from "@/lib/routes";
import {
  createLocalSession,
  getLocalIdentityByEmail,
  hashPassword,
  revokeCurrentLocalSession,
  verifyPassword
} from "./local";
import { loginSchema, signUpSchema } from "./schemas";

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

function buildErrorPath(path: string, error: string) {
  const params = new URLSearchParams({ error });
  return `${path}?${params.toString()}`;
}

export async function signUpAction(formData: FormData) {
  const parsed = signUpSchema.safeParse({
    displayName: formData.get("displayName"),
    email: formData.get("email"),
    phoneNumber: formData.get("phoneNumber"),
    password: formData.get("password"),
    role: formData.get("role"),
    preferredPlatformLanguage: formData.get("preferredPlatformLanguage") || "en",
    preferredSessionLanguage: formData.get("preferredSessionLanguage") || "en",
    countryCode: formData.get("countryCode") || undefined,
    timeZone: formData.get("timeZone") || "UTC"
  });

  if (!parsed.success) {
    redirect(
      asRoute(buildErrorPath("/signup", "Check the signup fields and try again."))
    );
  }

  const input = parsed.data;

  if (isLocalAuthProvider()) {
    const db = getDb();
    const passwordHash = await hashPassword(input.password);

    try {
      const platformUser = await db.transaction(async (tx) => {
        const [createdUser] = await tx
          .insert(users)
          .values({
            email: input.email,
            phoneNumber: input.phoneNumber,
            displayName: input.displayName,
            preferredPlatformLanguage: input.preferredPlatformLanguage,
            preferredSessionLanguage: input.preferredSessionLanguage,
            countryCode: input.countryCode,
            timeZone: input.timeZone
          })
          .returning();

        await tx.insert(localAuthIdentities).values({
          userId: createdUser.id,
          passwordHash
        });

        await tx.insert(userRoles).values({
          userId: createdUser.id,
          role: input.role
        });

        if (input.role === "student") {
          await tx.insert(studentProfiles).values({ userId: createdUser.id });
        } else {
          await tx.insert(speakerProfiles).values({ userId: createdUser.id });
        }

        await tx.insert(verificationEvents).values({
          userId: createdUser.id,
          type: "email_otp",
          status: "sent",
          target: input.email,
          provider: "dev"
        });

        await tx.insert(verificationEvents).values({
          userId: createdUser.id,
          type: "phone_otp",
          status: "sent",
          target: input.phoneNumber,
          provider: "dev"
        });

        return createdUser;
      });

      await createLocalSession(platformUser.id);
    } catch {
      redirect(
        asRoute(
          buildErrorPath(
            "/signup",
            "An account with that email or phone number may already exist."
          )
        )
      );
    }

    redirect(
      asRoute(
        buildVerifyPath(
          input.email,
          input.phoneNumber,
          "Account created in local mode. Use the development verification code to continue."
        )
      )
    );
  }

  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      data: {
        displayName: input.displayName,
        phoneNumber: input.phoneNumber,
        role: input.role
      }
    }
  });

  if (error || !data.user) {
    redirect(
      asRoute(
      buildErrorPath(
        "/signup",
        error?.message ?? "Unable to create the account right now."
      )
      )
    );
  }

  const db = getDb();
  const now = new Date();

  await db
    .insert(users)
    .values({
      id: data.user.id,
      email: input.email,
      phoneNumber: input.phoneNumber,
      displayName: input.displayName,
      preferredPlatformLanguage: input.preferredPlatformLanguage,
      preferredSessionLanguage: input.preferredSessionLanguage,
      countryCode: input.countryCode,
      timeZone: input.timeZone
    })
    .onConflictDoUpdate({
      target: users.id,
      set: {
        email: input.email,
        phoneNumber: input.phoneNumber,
        displayName: input.displayName,
        preferredPlatformLanguage: input.preferredPlatformLanguage,
        preferredSessionLanguage: input.preferredSessionLanguage,
        countryCode: input.countryCode,
        timeZone: input.timeZone,
        updatedAt: now
      }
    });

  await db
    .insert(userRoles)
    .values({ userId: data.user.id, role: input.role })
    .onConflictDoNothing();

  if (input.role === "student") {
    await db
      .insert(studentProfiles)
      .values({ userId: data.user.id })
      .onConflictDoNothing();
  } else {
    await db
      .insert(speakerProfiles)
      .values({ userId: data.user.id })
      .onConflictDoNothing();
  }

  await db.insert(verificationEvents).values({
    userId: data.user.id,
    type: "email_otp",
    status: "sent",
    target: input.email,
    provider: "supabase",
    providerReference: data.user.id
  });

  redirect(
    asRoute(
    buildVerifyPath(
      input.email,
      input.phoneNumber,
      "Account created. Verify email and phone to continue."
    )
    )
  );
}

export async function loginAction(formData: FormData) {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password")
  });

  if (!parsed.success) {
    redirect(asRoute(buildErrorPath("/login", "Enter a valid email and password.")));
  }

  if (isLocalAuthProvider()) {
    const record = await getLocalIdentityByEmail(parsed.data.email);

    if (
      !record ||
      record.user.status !== "active" ||
      !(await verifyPassword(parsed.data.password, record.identity.passwordHash))
    ) {
      redirect(asRoute(buildErrorPath("/login", "Invalid email or password.")));
    }

    await createLocalSession(record.user.id);
    redirect(asRoute("/dashboard"));
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    redirect(asRoute(buildErrorPath("/login", error.message)));
  }

  redirect(asRoute("/dashboard"));
}

export async function logoutAction() {
  if (isLocalAuthProvider()) {
    await revokeCurrentLocalSession();
    redirect(asRoute("/login"));
  }

  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect(asRoute("/login"));
}

export async function getUserByEmail(email: string) {
  const db = getDb();
  const [platformUser] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  return platformUser;
}
