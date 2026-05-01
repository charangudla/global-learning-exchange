import Link from "next/link";
import { BookOpenCheck } from "lucide-react";
import { signUpAction } from "@/domains/auth/actions";
import { asRoute } from "@/lib/routes";

type PageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

const inputClass =
  "mt-2 w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-teal-700";

export default async function SignUpPage({ searchParams }: PageProps) {
  const params = await searchParams;

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-950">
      <div className="mx-auto max-w-2xl">
        <Link className="text-sm font-semibold text-teal-700" href="/">
          Back to home
        </Link>

        <section className="mt-6 rounded border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded bg-teal-700 text-white">
              <BookOpenCheck size={22} aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500">
                Create account
              </p>
              <h1 className="text-2xl font-bold">Join Global Learning Exchange</h1>
            </div>
          </div>

          {params.error ? (
            <div className="mt-5 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {params.error}
            </div>
          ) : null}

          <form action={signUpAction} className="mt-6 grid gap-4">
            <label className="text-sm font-medium">
              Full name
              <input
                className={inputClass}
                name="displayName"
                placeholder="Your name"
                required
              />
            </label>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm font-medium">
                Email
                <input
                  className={inputClass}
                  name="email"
                  placeholder="you@example.com"
                  required
                  type="email"
                />
              </label>

              <label className="text-sm font-medium">
                Phone number
                <input
                  className={inputClass}
                  name="phoneNumber"
                  placeholder="+13125550123"
                  required
                />
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm font-medium">
                Password
                <input
                  className={inputClass}
                  minLength={8}
                  name="password"
                  required
                  type="password"
                />
              </label>

              <label className="text-sm font-medium">
                Role
                <select className={inputClass} name="role" required>
                  <option value="student">Student</option>
                  <option value="speaker">Speaker / tutor</option>
                </select>
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm font-medium">
                Platform language
                <input
                  className={inputClass}
                  defaultValue="en"
                  name="preferredPlatformLanguage"
                  required
                />
              </label>

              <label className="text-sm font-medium">
                Session language
                <input
                  className={inputClass}
                  defaultValue="en"
                  name="preferredSessionLanguage"
                  required
                />
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm font-medium">
                Country code
                <input
                  className={inputClass}
                  defaultValue="US"
                  maxLength={2}
                  minLength={2}
                  name="countryCode"
                />
              </label>

              <label className="text-sm font-medium">
                Time zone
                <input
                  className={inputClass}
                  defaultValue="America/Chicago"
                  name="timeZone"
                  required
                />
              </label>
            </div>

            <button className="rounded bg-teal-700 px-5 py-3 text-sm font-semibold text-white hover:bg-teal-800">
              Create account
            </button>
          </form>

          <p className="mt-5 text-sm text-slate-600">
            Already have an account?{" "}
            <Link className="font-semibold text-teal-700" href={asRoute("/login")}>
              Log in
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
