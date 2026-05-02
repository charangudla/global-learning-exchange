"use server";

import { redirect } from "next/navigation";
import { getDb } from "@/db/client";
import { studentRequests } from "@/db/schema";
import { getCurrentUserContext } from "@/domains/auth/context";
import { buildVerifyRoute } from "@/domains/verification/routes";
import { asRoute } from "@/lib/routes";
import { createStudentRequestSchema } from "./schemas";

function buildErrorRoute(error: string) {
  const params = new URLSearchParams({ error });
  return asRoute(`/requests/new?${params.toString()}`);
}

export async function createStudentRequestAction(formData: FormData) {
  const parsed = createStudentRequestSchema.safeParse({
    title: formData.get("title") ?? "",
    description: formData.get("description") ?? "",
    educationLevel: formData.get("educationLevel") ?? "",
    preferredLanguage: formData.get("preferredLanguage") ?? "en",
    urgency: formData.get("urgency") ?? "flexible",
    sessionIntent: formData.get("sessionIntent") ?? "free",
    paymentOfferCents: formData.get("paymentOfferDollars") ?? "",
    preferredStartAt: formData.get("preferredStartAt") ?? "",
    preferredEndAt: formData.get("preferredEndAt") ?? "",
  });

  if (!parsed.success) {
    redirect(buildErrorRoute("Check the request details and try again."));
  }

  const context = await getCurrentUserContext();

  if (context.setupError) {
    redirect(asRoute("/dashboard"));
  }

  if (!context.authUser) {
    redirect(asRoute("/login"));
  }

  const platformUser = context.platformUser;

  if (!platformUser || platformUser.status !== "active") {
    redirect(asRoute("/dashboard"));
  }

  if (!platformUser.emailVerifiedAt || !platformUser.phoneVerifiedAt) {
    redirect(
      buildVerifyRoute({
        email: platformUser.email,
        phoneNumber: platformUser.phoneNumber,
        message: "Verify email and phone before posting a request.",
      }),
    );
  }

  const input = parsed.data;
  const db = getDb();
  const [request] = await db
    .insert(studentRequests)
    .values({
      studentId: platformUser.id,
      title: input.title,
      description: input.description,
      educationLevel: input.educationLevel,
      preferredLanguage: input.preferredLanguage,
      urgency: input.urgency,
      sessionIntent: input.sessionIntent,
      paymentOfferCents: input.paymentOfferCents,
      preferredTimeWindows: input.preferredTimeWindows,
    })
    .returning({ id: studentRequests.id });

  redirect(asRoute(`/requests/${request.id}`));
}
