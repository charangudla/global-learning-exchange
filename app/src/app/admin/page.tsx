import { Ban, RotateCcw, ShieldAlert, Users } from "lucide-react";
import Link from "next/link";

const moderationTargets = [
  "Users",
  "Speakers",
  "Requests",
  "Bookings",
  "Sessions",
  "Reviews",
  "Notes",
  "Recordings",
  "Content"
];

export default function AdminPreviewPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-950">
      <div className="mx-auto max-w-7xl">
        <Link className="text-sm font-semibold text-teal-700" href="/">
          Back to MVP workspace
        </Link>
        <div className="mt-6 flex flex-col gap-3 border-b border-slate-200 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">
              Admin preview
            </p>
            <h1 className="mt-2 text-3xl font-bold">
              Moderation and verification controls
            </h1>
          </div>
          <div className="rounded border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600">
            Audit log required for every action
          </div>
        </div>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded border border-slate-200 bg-white p-5">
            <Users className="text-blue-700" size={24} />
            <h2 className="mt-4 font-semibold">Verification exceptions</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Review speakers flagged by automated verification, reports, or
              missing credibility signals.
            </p>
          </div>
          <div className="rounded border border-slate-200 bg-white p-5">
            <Ban className="text-red-700" size={24} />
            <h2 className="mt-4 font-semibold">Block platform activity</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Block users, requests, bookings, sessions, reviews, notes,
              recordings, and public content without deleting history.
            </p>
          </div>
          <div className="rounded border border-slate-200 bg-white p-5">
            <RotateCcw className="text-teal-700" size={24} />
            <h2 className="mt-4 font-semibold">Restore with accountability</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Unblock or restore records while keeping the original action,
              reason, timestamp, and admin actor.
            </p>
          </div>
        </section>

        <section className="mt-8 rounded border border-slate-200 bg-white">
          <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
            <ShieldAlert className="text-amber-700" size={22} />
            <h2 className="font-semibold">Moderation targets</h2>
          </div>
          <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3">
            {moderationTargets.map((target) => (
              <div
                className="rounded border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium"
                key={target}
              >
                {target}
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
