import Link from "next/link";
import { redirect } from "next/navigation";
import { Bot, CalendarClock, CheckCircle2, ShieldCheck } from "lucide-react";
import { logoutAction } from "@/domains/auth/actions";
import { getCurrentUserContext } from "@/domains/auth/context";
import { asRoute } from "@/lib/routes";

export const dynamic = "force-dynamic";

const nextActions = [
  {
    title: "Ask AI tutor",
    text: "Immediate AI help will live here first.",
    icon: Bot
  },
  {
    title: "Post a request",
    text: "Students will describe topic, language, urgency, and time windows.",
    icon: CalendarClock
  },
  {
    title: "Find verified speakers",
    text: "Marketplace filters will use subject, language, availability, and trust.",
    icon: ShieldCheck
  }
];

export default async function DashboardPage() {
  const context = await getCurrentUserContext();

  if (context.setupError) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-950">
        <div className="mx-auto max-w-3xl rounded border border-amber-200 bg-amber-50 p-6">
          <p className="text-sm font-semibold text-amber-800">Setup needed</p>
          <h1 className="mt-2 text-2xl font-bold">Connect Supabase first</h1>
          <p className="mt-3 text-sm leading-6 text-amber-900">
            {context.setupError} Once `.env.local` is configured, this dashboard
            will read the authenticated user and platform verification status.
          </p>
          <Link
            className="mt-5 inline-flex rounded bg-amber-900 px-4 py-2 text-sm font-semibold text-white"
            href="/"
          >
            Back to home
          </Link>
        </div>
      </main>
    );
  }

  if (!context.authUser) {
    redirect(asRoute("/login"));
  }

  const platformUser = context.platformUser;
  const emailVerified = Boolean(platformUser?.emailVerifiedAt);
  const phoneVerified = Boolean(platformUser?.phoneVerifiedAt);
  const fullyVerified = emailVerified && phoneVerified;

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-950">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-4 border-b border-slate-200 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">
              Dashboard
            </p>
            <h1 className="mt-2 text-3xl font-bold">
              {platformUser?.displayName ?? context.authUser.email}
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              {context.authUser.email}
            </p>
          </div>

          <form action={logoutAction}>
            <button className="rounded border border-slate-300 bg-white px-4 py-2 text-sm font-semibold hover:border-slate-400">
              Log out
            </button>
          </form>
        </header>

        <section className="mt-6 rounded border border-slate-200 bg-white p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-3">
              <CheckCircle2
                className={fullyVerified ? "text-teal-700" : "text-slate-400"}
                size={26}
              />
              <div>
                <h2 className="font-semibold">Account verification</h2>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Booking, chat, requests, and speaker actions stay locked until
                  email and phone are verified.
                </p>
              </div>
            </div>

            {!fullyVerified ? (
              <Link
                className="rounded bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800"
                href={asRoute(
                  `/verify?email=${encodeURIComponent(
                    platformUser?.email ?? context.authUser.email ?? ""
                  )}&phone=${encodeURIComponent(platformUser?.phoneNumber ?? "")}`
                )}
              >
                Finish verification
              </Link>
            ) : null}
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <div className="rounded border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Email</p>
              <p className="mt-1 font-semibold">
                {emailVerified ? "Verified" : "Not verified"}
              </p>
            </div>
            <div className="rounded border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Phone</p>
              <p className="mt-1 font-semibold">
                {phoneVerified ? "Verified" : "Not verified"}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-3">
          {nextActions.map((item) => {
            const Icon = item.icon;

            return (
              <article
                className="rounded border border-slate-200 bg-white p-5"
                key={item.title}
              >
                <Icon className="text-blue-700" size={24} />
                <h2 className="mt-4 font-semibold">{item.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {item.text}
                </p>
                <p className="mt-4 text-sm font-semibold text-slate-500">
                  {fullyVerified ? "Ready for next build step" : "Locked"}
                </p>
              </article>
            );
          })}
        </section>
      </div>
    </main>
  );
}
