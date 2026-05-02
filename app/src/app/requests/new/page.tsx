import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, CalendarClock, FileText, Languages } from "lucide-react";
import { getCurrentUserContext } from "@/domains/auth/context";
import { createStudentRequestAction } from "@/domains/requests/actions";
import { buildVerifyRoute } from "@/domains/verification/routes";
import { asRoute } from "@/lib/routes";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

const inputClass =
  "mt-2 w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-teal-700";

const financialIntentOptions = [
  {
    label: "Free",
    value: "free",
  },
  {
    label: "Free + donation",
    value: "free_donations_accepted",
  },
  {
    label: "Open to quotes",
    value: "paid_requested",
  },
  {
    label: "I can offer",
    value: "student_offer",
  },
  {
    label: "Sponsored",
    value: "sponsored",
  },
];

export default async function NewRequestPage({ searchParams }: PageProps) {
  const [params, context] = await Promise.all([
    searchParams,
    getCurrentUserContext(),
  ]);

  if (context.setupError) {
    redirect(asRoute("/dashboard"));
  }

  if (!context.authUser) {
    redirect(asRoute("/login"));
  }

  const platformUser = context.platformUser;

  if (!platformUser) {
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

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-950">
      <div className="mx-auto max-w-4xl">
        <Link
          className="inline-flex items-center gap-2 text-sm font-semibold text-teal-700"
          href={asRoute("/requests")}
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Back to requests
        </Link>

        <section className="mt-6 rounded border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex size-10 items-center justify-center rounded bg-teal-700 text-white">
              <FileText size={22} aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500">
                Student request
              </p>
              <h1 className="text-2xl font-bold">
                Post a one-on-one learning request
              </h1>
            </div>
          </div>

          {params.error ? (
            <div className="mt-5 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {params.error}
            </div>
          ) : null}

          <form action={createStudentRequestAction} className="mt-6 grid gap-5">
            <label className="text-sm font-medium">
              Topic title
              <input
                className={inputClass}
                name="title"
                placeholder="Help with linear algebra eigenvalues"
                required
              />
            </label>

            <label className="text-sm font-medium">
              Details
              <textarea
                className={`${inputClass} min-h-36 resize-y leading-6`}
                name="description"
                placeholder="Describe what you are learning, where you are stuck, and what a good session should cover."
                required
              />
            </label>

            <div className="grid gap-4 md:grid-cols-3">
              <label className="text-sm font-medium">
                Education level
                <input
                  className={inputClass}
                  name="educationLevel"
                  placeholder="High school, college, self learner"
                />
              </label>

              <label className="text-sm font-medium">
                Preferred language
                <span className="mt-2 flex items-center gap-2">
                  <Languages size={17} aria-hidden="true" />
                  <input
                    className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-teal-700"
                    defaultValue={platformUser.preferredSessionLanguage}
                    name="preferredLanguage"
                    required
                  />
                </span>
              </label>

              <label className="text-sm font-medium">
                Urgency
                <select
                  className={inputClass}
                  defaultValue="flexible"
                  name="urgency"
                >
                  <option value="flexible">Flexible</option>
                  <option value="this_week">This week</option>
                  <option value="next_24_hours">Next 24 hours</option>
                  <option value="urgent">Urgent</option>
                </select>
              </label>
            </div>

            <div>
              <p className="text-sm font-medium">Session intent</p>
              <div className="mt-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                {financialIntentOptions.map((option) => (
                  <label
                    className="flex min-h-16 items-center gap-2 rounded border border-slate-300 bg-slate-50 px-3 py-2 text-sm font-semibold"
                    key={option.value}
                  >
                    <input
                      defaultChecked={option.value === "free"}
                      name="sessionIntent"
                      type="radio"
                      value={option.value}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <label className="text-sm font-medium">
              Offer amount
              <input
                className={inputClass}
                inputMode="decimal"
                name="paymentOfferDollars"
                placeholder="Only for I can offer or sponsored"
              />
            </label>

            <div>
              <div className="flex items-center gap-2">
                <CalendarClock className="text-blue-700" size={19} />
                <p className="text-sm font-medium">
                  Preferred time window ({platformUser.timeZone})
                </p>
              </div>
              <div className="mt-2 grid gap-4 md:grid-cols-2">
                <label className="text-sm font-medium text-slate-700">
                  Start
                  <input
                    className={inputClass}
                    name="preferredStartAt"
                    type="datetime-local"
                  />
                </label>
                <label className="text-sm font-medium text-slate-700">
                  End
                  <input
                    className={inputClass}
                    name="preferredEndAt"
                    type="datetime-local"
                  />
                </label>
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-600">
                Status will be open after submission.
              </p>
              <button className="rounded bg-teal-700 px-5 py-3 text-sm font-semibold text-white hover:bg-teal-800">
                Post request
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
