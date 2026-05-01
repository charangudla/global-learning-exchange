import Link from "next/link";
import { loginAction } from "@/domains/auth/actions";
import { asRoute } from "@/lib/routes";

type PageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

const inputClass =
  "mt-2 w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-teal-700";

export default async function LoginPage({ searchParams }: PageProps) {
  const params = await searchParams;

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-950">
      <div className="mx-auto max-w-md">
        <Link className="text-sm font-semibold text-teal-700" href="/">
          Back to home
        </Link>

        <section className="mt-6 rounded border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">
            Welcome back
          </p>
          <h1 className="mt-1 text-2xl font-bold">Log in</h1>

          {params.error ? (
            <div className="mt-5 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {params.error}
            </div>
          ) : null}

          <form action={loginAction} className="mt-6 grid gap-4">
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
              Password
              <input
                className={inputClass}
                name="password"
                required
                type="password"
              />
            </label>

            <button className="rounded bg-teal-700 px-5 py-3 text-sm font-semibold text-white hover:bg-teal-800">
              Log in
            </button>
          </form>

          <p className="mt-5 text-sm text-slate-600">
            New here?{" "}
            <Link className="font-semibold text-teal-700" href={asRoute("/signup")}>
              Create an account
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
