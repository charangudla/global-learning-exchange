import Link from "next/link";
import { redirect } from "next/navigation";
import {
  CalendarClock,
  CircleDollarSign,
  FileText,
  Languages,
  Plus,
} from "lucide-react";
import type { StudentRequest } from "@/db/schema";
import { getCurrentUserContext } from "@/domains/auth/context";
import { getMyStudentRequests } from "@/domains/requests/queries";
import { buildVerifyRoute } from "@/domains/verification/routes";
import { asRoute } from "@/lib/routes";

export const dynamic = "force-dynamic";

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

function formatCreatedAt(value: Date) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

function RequestCard({ request }: { request: StudentRequest }) {
  const money = formatMoney(request.paymentOfferCents);

  return (
    <article className="rounded border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-800">
              {statusLabels[request.status]}
            </span>
            <span className="rounded bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-800">
              {urgencyLabels[request.urgency]}
            </span>
          </div>
          <h2 className="mt-3 text-xl font-bold text-slate-950">
            {request.title}
          </h2>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
            {request.description}
          </p>
        </div>

        <Link
          className="inline-flex items-center justify-center rounded bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          href={asRoute(`/requests/${request.id}`)}
        >
          Open
        </Link>
      </div>

      <div className="mt-5 grid gap-3 text-sm text-slate-600 md:grid-cols-3">
        <div className="flex items-center gap-2">
          <Languages size={17} aria-hidden="true" />
          <span>{request.preferredLanguage}</span>
        </div>
        <div className="flex items-center gap-2">
          <CircleDollarSign size={17} aria-hidden="true" />
          <span>
            {money
              ? `${intentLabels[request.sessionIntent]} ${money}`
              : intentLabels[request.sessionIntent]}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <CalendarClock size={17} aria-hidden="true" />
          <span>{formatCreatedAt(request.createdAt)}</span>
        </div>
      </div>
    </article>
  );
}

export default async function RequestsPage() {
  const context = await getCurrentUserContext();

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
        message: "Verify email and phone before opening requests.",
      }),
    );
  }

  const requests = await getMyStudentRequests(platformUser.id);

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-950">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-col gap-4 border-b border-slate-200 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Link
              className="text-sm font-semibold text-teal-700"
              href={asRoute("/dashboard")}
            >
              Back to dashboard
            </Link>
            <h1 className="mt-3 text-3xl font-bold">My learning requests</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Track the topics you have posted for verified speakers and tutors.
            </p>
          </div>

          <Link
            className="inline-flex items-center justify-center gap-2 rounded bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800"
            href={asRoute("/requests/new")}
          >
            <Plus size={17} aria-hidden="true" />
            New request
          </Link>
        </header>

        {requests.length > 0 ? (
          <section className="mt-6 grid gap-4">
            {requests.map((request) => (
              <RequestCard key={request.id} request={request} />
            ))}
          </section>
        ) : (
          <section className="mt-6 rounded border border-slate-200 bg-white p-8 text-center shadow-sm">
            <FileText
              className="mx-auto text-slate-400"
              size={36}
              aria-hidden="true"
            />
            <h2 className="mt-4 text-xl font-bold">No requests yet</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-600">
              Create the first request with topic, preferred language, urgency,
              payment intent, and an optional preferred time window.
            </p>
            <Link
              className="mt-5 inline-flex items-center justify-center gap-2 rounded bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800"
              href={asRoute("/requests/new")}
            >
              <Plus size={17} aria-hidden="true" />
              New request
            </Link>
          </section>
        )}
      </div>
    </main>
  );
}
