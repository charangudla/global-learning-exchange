import {
  BadgeCheck,
  BookOpenCheck,
  Bot,
  CalendarClock,
  MessageSquareText,
  ShieldCheck,
  Star
} from "lucide-react";
import Link from "next/link";

const marketplaceStats = [
  { label: "AI tutor", value: "Immediate" },
  { label: "Speaker flow", value: "Verified" },
  { label: "Session type", value: "1:1 MVP" },
  { label: "Access", value: "Global" }
];

const workflow = [
  {
    icon: Bot,
    title: "Ask AI first",
    text: "Students can get immediate help and turn a question into a session request."
  },
  {
    icon: BadgeCheck,
    title: "Find verified speakers",
    text: "Email, phone, and profile signals support automated speaker verification."
  },
  {
    icon: CalendarClock,
    title: "Book a session",
    text: "Calendar holds, clear status, and meeting links keep the session path visible."
  },
  {
    icon: Star,
    title: "Review and learn",
    text: "Ratings, notes, and history help the platform reward reliable participation."
  }
];

const dashboardItems = [
  "Post a learning request",
  "Browse verified speakers",
  "Continue AI tutoring",
  "Review upcoming bookings",
  "Open admin moderation"
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded bg-teal-700 text-white">
              <BookOpenCheck size={22} aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500">
                Global Learning Exchange
              </p>
              <h1 className="text-lg font-bold">MVP workspace</h1>
            </div>
          </div>
          <nav className="hidden items-center gap-5 text-sm font-medium text-slate-600 md:flex">
            <a href="#workflow">Workflow</a>
            <a href="#dashboard">Dashboard</a>
            <a href="#trust">Trust</a>
          </nav>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-10 lg:grid-cols-[1.1fr_0.9fr] lg:py-14">
        <div className="flex flex-col justify-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-teal-700">
            Nonprofit-first education marketplace
          </p>
          <h2 className="max-w-3xl text-4xl font-bold leading-tight text-slate-950 md:text-5xl">
            A testable MVP for global one-on-one learning support.
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Students get immediate AI help, request human tutoring, book verified
            speakers, chat before sessions, complete talks, and build history
            through reviews, notes, and moderation-ready records.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a
              className="rounded bg-teal-700 px-5 py-3 text-sm font-semibold text-white hover:bg-teal-800"
              href="#dashboard"
            >
              View MVP dashboard
            </a>
            <Link
              className="rounded border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 hover:border-slate-400"
              href="/admin"
            >
              Admin preview
            </Link>
          </div>
        </div>

        <aside className="rounded border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid gap-3 sm:grid-cols-2">
            {marketplaceStats.map((stat) => (
              <div
                className="rounded border border-slate-200 bg-slate-50 p-4"
                key={stat.label}
              >
                <p className="text-sm text-slate-500">{stat.label}</p>
                <p className="mt-1 text-xl font-bold text-slate-950">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded border border-teal-100 bg-teal-50 p-4">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-1 text-teal-700" size={22} />
              <div>
                <h3 className="font-semibold text-slate-950">
                  Verification before activity
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Every user verifies email and phone. Speakers add credibility
                  links before they can accept sessions.
                </p>
              </div>
            </div>
          </div>
        </aside>
      </section>

      <section
        className="border-y border-slate-200 bg-white px-6 py-10"
        id="workflow"
      >
        <div className="mx-auto max-w-7xl">
          <h2 className="text-2xl font-bold text-slate-950">Core Workflow</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-4">
            {workflow.map((item) => {
              const Icon = item.icon;
              return (
                <article
                  className="rounded border border-slate-200 bg-white p-5"
                  key={item.title}
                >
                  <Icon className="text-blue-700" size={24} aria-hidden="true" />
                  <h3 className="mt-4 font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {item.text}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-6 py-10 lg:grid-cols-3">
        <div className="lg:col-span-2" id="dashboard">
          <h2 className="text-2xl font-bold text-slate-950">
            First dashboard targets
          </h2>
          <div className="mt-5 rounded border border-slate-200 bg-white">
            {dashboardItems.map((item) => (
              <div
                className="flex items-center justify-between border-b border-slate-100 px-5 py-4 last:border-b-0"
                key={item}
              >
                <span className="font-medium text-slate-800">{item}</span>
                <span className="text-sm text-slate-500">Planned</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded border border-slate-200 bg-white p-5" id="trust">
          <MessageSquareText className="text-teal-700" size={25} />
          <h2 className="mt-4 text-xl font-bold text-slate-950">
            Moderation-ready by design
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Requests, bookings, chats, reviews, notes, recordings, and user
            actions will keep statuses and audit logs so admins can block,
            unblock, hide, restore, or dispute platform activity.
          </p>
        </div>
      </section>
    </main>
  );
}
