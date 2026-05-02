import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  ArrowLeft,
  CalendarClock,
  CircleDollarSign,
  Languages,
  ShieldCheck,
} from "lucide-react";
import type { StudentRequest } from "@/db/schema";
import { getCurrentUserContext } from "@/domains/auth/context";
import { getStudentRequestForStudent } from "@/domains/requests/queries";
import { buildVerifyRoute } from "@/domains/verification/routes";
import { asRoute } from "@/lib/routes";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

const statusLabels: Record<StudentRequest["status"], string> = {
  draft: "Draft",
  open: "Open",
  matched: "Matched",
  booked: "Booked",
  cancelled: "Cancelled",
  cancelled_by_admin: "Cancelled by admin",
  completed: "Completed",
  blocked: "Blocked",
};

const urgencyLabels: Record<StudentRequest["urgency"], string> = {
  flexible: "Flexible",
  this_week: "This week",
  next_24_hours: "Next 24 hours",
  urgent: "Urgent",
};

const intentLabels: Record<StudentRequest["sessionIntent"], string> = {
  free: "Free",
  free_donations_accepted: "Free, donations welcome",
  paid_requested: "Open to paid quotes",
  student_offer: "Student offer",
  sponsored: "Sponsored",
};

function formatMoney(cents: number | null) {
  if (cents === null) {
    return null;
  }

  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    style: "currency",
  }).format(cents / 100);
}

function formatDateTime(value: string | Date) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(typeof value === "string" ? new Date(value) : value);
}

function formatPreferredWindow(request: StudentRequest) {
  const [window] = request.preferredTimeWindows;

  if (!window) {
    return "No preferred window added";
  }

  return `${formatDateTime(window.startAt)} to ${formatDateTime(window.endAt)}`;
}

export default async function RequestDetailPage({ params }: PageProps) {
  const [{ id }, context] = await Promise.all([
    params,
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
        message: "Verify email and phone before opening request details.",
      }),
    );
  }

  const request = await getStudentRequestForStudent(id, platformUser.id);

  if (!request) {
    notFound();
  }

  const money = formatMoney(request.paymentOfferCents);

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-950">
      <div className="mx-auto max-w-5xl">
        <Link
          className="inline-flex items-center gap-2 text-sm font-semibold text-teal-700"
          href={asRoute("/requests")}
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Back to requests
        </Link>

        <section className="mt-6 rounded border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-800">
                  {statusLabels[request.status]}
                </span>
                <span className="rounded bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-800">
                  {urgencyLabels[request.urgency]}
                </span>
              </div>
              <h1 className="mt-4 text-3xl font-bold">{request.title}</h1>
              <p className="mt-2 text-sm text-slate-500">
                Posted {formatDateTime(request.createdAt)}
              </p>
            </div>

            <div className="rounded border border-teal-100 bg-teal-50 px-4 py-3 text-sm font-semibold text-teal-900">
              Ready for speaker response flow
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_18rem]">
            <div>
              <h2 className="text-lg font-bold">Request details</h2>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-700">
                {request.description}
              </p>
            </div>

            <aside className="grid gap-3 text-sm">
              <div className="flex items-start gap-3 rounded border border-slate-200 bg-slate-50 p-4">
                <Languages
                  className="mt-0.5 text-blue-700"
                  size={18}
                  aria-hidden="true"
                />
                <div>
                  <p className="font-semibold">Language</p>
                  <p className="mt-1 text-slate-600">
                    {request.preferredLanguage}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded border border-slate-200 bg-slate-50 p-4">
                <CircleDollarSign
                  className="mt-0.5 text-blue-700"
                  size={18}
                  aria-hidden="true"
                />
                <div>
                  <p className="font-semibold">Session intent</p>
                  <p className="mt-1 text-slate-600">
                    {money
                      ? `${intentLabels[request.sessionIntent]} ${money}`
                      : intentLabels[request.sessionIntent]}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded border border-slate-200 bg-slate-50 p-4">
                <CalendarClock
                  className="mt-0.5 text-blue-700"
                  size={18}
                  aria-hidden="true"
                />
                <div>
                  <p className="font-semibold">Preferred window</p>
                  <p className="mt-1 text-slate-600">
                    {formatPreferredWindow(request)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded border border-slate-200 bg-slate-50 p-4">
                <ShieldCheck
                  className="mt-0.5 text-teal-700"
                  size={18}
                  aria-hidden="true"
                />
                <div>
                  <p className="font-semibold">Trust gate</p>
                  <p className="mt-1 text-slate-600">
                    Only verified users can create or respond to requests.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}
