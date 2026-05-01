import Link from "next/link";
import {
  resendEmailOtpAction,
  sendPhoneOtpAction,
  verifyEmailOtpAction,
  verifyPhoneOtpAction
} from "@/domains/verification/actions";
import { asRoute } from "@/lib/routes";

type PageProps = {
  searchParams: Promise<{
    email?: string;
    phone?: string;
    error?: string;
    message?: string;
  }>;
};

const inputClass =
  "mt-2 w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-teal-700";

export default async function VerifyPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const email = params.email ?? "";
  const phoneNumber = params.phone ?? "";

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-950">
      <div className="mx-auto max-w-3xl">
        <Link className="text-sm font-semibold text-teal-700" href="/">
          Back to home
        </Link>

        <section className="mt-6 rounded border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">
            Required verification
          </p>
          <h1 className="mt-1 text-2xl font-bold">Verify email and phone</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Every user must verify both email and phone before using booking,
            chat, requests, speaker profiles, or dashboard actions.
          </p>

          {params.message ? (
            <div className="mt-5 rounded border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-800">
              {params.message}
            </div>
          ) : null}

          {params.error ? (
            <div className="mt-5 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {params.error}
            </div>
          ) : null}

          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            <div className="rounded border border-slate-200 bg-slate-50 p-4">
              <h2 className="font-semibold">Email verification</h2>

              <form action={resendEmailOtpAction} className="mt-4 grid gap-3">
                <label className="text-sm font-medium">
                  Email
                  <input
                    className={inputClass}
                    defaultValue={email}
                    name="email"
                    required
                    type="email"
                  />
                </label>
                <input name="phoneNumber" type="hidden" value={phoneNumber} />
                <button className="rounded border border-slate-300 bg-white px-4 py-2 text-sm font-semibold hover:border-slate-400">
                  Send email code
                </button>
              </form>

              <form action={verifyEmailOtpAction} className="mt-5 grid gap-3">
                <input name="email" type="hidden" value={email} />
                <input name="phoneNumber" type="hidden" value={phoneNumber} />
                <label className="text-sm font-medium">
                  Email code
                  <input
                    className={inputClass}
                    inputMode="numeric"
                    name="token"
                    required
                  />
                </label>
                <button className="rounded bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800">
                  Verify email
                </button>
              </form>
            </div>

            <div className="rounded border border-slate-200 bg-slate-50 p-4">
              <h2 className="font-semibold">Phone verification</h2>

              <form action={sendPhoneOtpAction} className="mt-4 grid gap-3">
                <label className="text-sm font-medium">
                  Email
                  <input
                    className={inputClass}
                    defaultValue={email}
                    name="email"
                    required
                    type="email"
                  />
                </label>
                <label className="text-sm font-medium">
                  Phone
                  <input
                    className={inputClass}
                    defaultValue={phoneNumber}
                    name="phoneNumber"
                    placeholder="+13125550123"
                    required
                  />
                </label>
                <button className="rounded border border-slate-300 bg-white px-4 py-2 text-sm font-semibold hover:border-slate-400">
                  Send phone code
                </button>
              </form>

              <form action={verifyPhoneOtpAction} className="mt-5 grid gap-3">
                <input name="email" type="hidden" value={email} />
                <input name="phoneNumber" type="hidden" value={phoneNumber} />
                <label className="text-sm font-medium">
                  Phone code
                  <input
                    className={inputClass}
                    inputMode="numeric"
                    name="token"
                    required
                  />
                </label>
                <button className="rounded bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800">
                  Verify phone
                </button>
              </form>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              className="rounded border border-slate-300 bg-white px-4 py-2 text-sm font-semibold hover:border-slate-400"
              href={asRoute("/login")}
            >
              Log in
            </Link>
            <Link
              className="rounded bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              href={asRoute("/dashboard")}
            >
              Open dashboard
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
