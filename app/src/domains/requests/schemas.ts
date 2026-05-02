import { z } from "zod";

export const requestUrgencySchema = z.enum([
  "flexible",
  "this_week",
  "next_24_hours",
  "urgent",
]);

export const sessionFinancialIntentSchema = z.enum([
  "free",
  "free_donations_accepted",
  "paid_requested",
  "student_offer",
  "sponsored",
]);

const optionalTextSchema = (maxLength: number) =>
  z
    .string()
    .trim()
    .max(maxLength)
    .transform((value) => (value.length > 0 ? value : null));

const optionalDateTimeSchema = z
  .string()
  .trim()
  .transform((value) => (value.length > 0 ? value : null));

const paymentAmountSchema = z
  .string()
  .trim()
  .transform((value, ctx) => {
    if (!value) {
      return null;
    }

    if (!/^\d+(\.\d{1,2})?$/.test(value)) {
      ctx.addIssue({
        code: "custom",
        message: "Use a valid amount, for example 25 or 25.00.",
      });
      return z.NEVER;
    }

    const [dollarsPart, centsPart = ""] = value.split(".");
    const cents =
      Number.parseInt(dollarsPart, 10) * 100 +
      Number.parseInt(centsPart.padEnd(2, "0"), 10);

    if (!Number.isSafeInteger(cents) || cents > 1_000_000) {
      ctx.addIssue({
        code: "custom",
        message: "Payment offers must be $10,000 or less.",
      });
      return z.NEVER;
    }

    return cents;
  });

function parseDateTime(value: string | null) {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export const createStudentRequestSchema = z
  .object({
    title: z.string().trim().min(8).max(140),
    description: z.string().trim().min(40).max(4000),
    educationLevel: optionalTextSchema(120),
    preferredLanguage: z
      .string()
      .trim()
      .min(2)
      .max(16)
      .transform((value) => value.toLowerCase()),
    urgency: requestUrgencySchema.default("flexible"),
    sessionIntent: sessionFinancialIntentSchema.default("free"),
    paymentOfferCents: paymentAmountSchema,
    preferredStartAt: optionalDateTimeSchema,
    preferredEndAt: optionalDateTimeSchema,
  })
  .superRefine((input, ctx) => {
    const amountIntent =
      input.sessionIntent === "student_offer" ||
      input.sessionIntent === "sponsored";

    if (amountIntent && input.paymentOfferCents === null) {
      ctx.addIssue({
        code: "custom",
        message: "Add the amount you can offer for this request.",
        path: ["paymentOfferCents"],
      });
    }

    if (!amountIntent && input.paymentOfferCents !== null) {
      ctx.addIssue({
        code: "custom",
        message:
          "Only student offer or sponsored requests can include an amount.",
        path: ["paymentOfferCents"],
      });
    }

    if (Boolean(input.preferredStartAt) !== Boolean(input.preferredEndAt)) {
      ctx.addIssue({
        code: "custom",
        message: "Add both a preferred start and end time.",
        path: ["preferredStartAt"],
      });
      return;
    }

    const startAt = parseDateTime(input.preferredStartAt);
    const endAt = parseDateTime(input.preferredEndAt);

    if (input.preferredStartAt && !startAt) {
      ctx.addIssue({
        code: "custom",
        message: "Use a valid preferred start time.",
        path: ["preferredStartAt"],
      });
    }

    if (input.preferredEndAt && !endAt) {
      ctx.addIssue({
        code: "custom",
        message: "Use a valid preferred end time.",
        path: ["preferredEndAt"],
      });
    }

    if (startAt && endAt && endAt <= startAt) {
      ctx.addIssue({
        code: "custom",
        message: "Preferred end time must be after the start time.",
        path: ["preferredEndAt"],
      });
    }
  })
  .transform((input) => {
    const startAt = parseDateTime(input.preferredStartAt);
    const endAt = parseDateTime(input.preferredEndAt);

    return {
      title: input.title,
      description: input.description,
      educationLevel: input.educationLevel,
      preferredLanguage: input.preferredLanguage,
      urgency: input.urgency,
      sessionIntent: input.sessionIntent,
      paymentOfferCents: input.paymentOfferCents,
      preferredTimeWindows:
        startAt && endAt
          ? [{ startAt: startAt.toISOString(), endAt: endAt.toISOString() }]
          : [],
    };
  });

export type CreateStudentRequestInput = z.infer<
  typeof createStudentRequestSchema
>;
