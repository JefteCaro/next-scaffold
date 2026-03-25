import Link from "next/link";
import { Github, LockKeyhole } from "lucide-react";
import ArrowRight from "@/components/icons/heroicons/outline/arrow-right";
import ShieldCheck from "@/components/icons/heroicons/outline/shield-check";
import Sparkles from "@/components/icons/heroicons/outline/sparkles";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { requireGuest } from "@/lib/auth";

import { loginAction } from "../auth-actions";
import { AuthForm } from "../auth-forms";

export const dynamic = "force-dynamic";

const trustPoints = [
  "Role-aware access across every workspace",
  "End-to-end audit trails for sensitive actions",
  "Encrypted sessions with device-level verification",
];

const activityHighlights = [
  { label: "Policies monitored", value: "128" },
  { label: "Signals resolved", value: "24h" },
  { label: "Workspace uptime", value: "99.98%" },
];

export default async function LoginPage() {
  await requireGuest();

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f8fafc] text-slate-950">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-24 top-[-12%] h-96 w-96 rounded-full bg-indigo-100/80 blur-3xl" />
        <div className="absolute -left-24 bottom-[-8%] h-112 w-md rounded-full bg-slate-200/70 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-slate-300 to-transparent" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-8 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between gap-4 py-4">
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20">
              <ShieldCheck className="size-5" />
            </span>
            <span>
              <span className="block text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
                Stery
              </span>
              <span className="block text-lg font-extrabold tracking-tight text-slate-900">
                Precision Dashboard
              </span>
            </span>
          </Link>

          <div className="hidden items-center gap-3 sm:flex">
            <span className="text-sm font-medium text-slate-500">
              Need access?
            </span>
            <Button
              variant="outline"
              className="h-10 rounded-xl border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
              render={<Link href="/signup" />}
            >
              Create account
            </Button>
          </div>
        </header>

        <section className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-[1.1fr_480px] lg:gap-16 lg:py-16">
          <div className="hidden lg:block">
            <div className="max-w-xl space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white/80 px-4 py-2 text-sm font-semibold text-indigo-700 shadow-sm backdrop-blur">
                <Sparkles className="size-4" />
                Institutional authority in data governance
              </div>

              <div className="space-y-4">
                <h1 className="text-5xl font-extrabold leading-tight tracking-tight text-slate-950">
                  Secure access for teams that move with precision.
                </h1>
                <p className="max-w-lg text-lg leading-8 text-slate-600">
                  A sharper, calmer login experience inspired by the reference
                  design—adapted for the dashboard with trust signals, clean
                  hierarchy, and fast paths back into your workspace.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {activityHighlights.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-white/80 bg-white/80 p-4 shadow-sm backdrop-blur"
                  >
                    <p className="text-2xl font-extrabold tracking-tight text-slate-900">
                      {item.value}
                    </p>
                    <p className="mt-1 text-sm font-medium text-slate-500">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>

              <div className="rounded-3xl border border-slate-200/80 bg-white/85 p-6 shadow-xl shadow-slate-200/40 backdrop-blur">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-2xl bg-slate-900 text-white">
                    <LockKeyhole className="size-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Trusted controls
                    </p>
                    <h2 className="text-xl font-bold tracking-tight text-slate-900">
                      Built for security-first operators
                    </h2>
                  </div>
                </div>

                <ul className="mt-6 space-y-4">
                  {trustPoints.map((point) => (
                    <li
                      key={point}
                      className="flex items-start gap-3 text-sm leading-6 text-slate-600"
                    >
                      <span className="mt-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-700">
                        <ShieldCheck className="size-3.5" />
                      </span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-x-8 top-6 h-24 rounded-full bg-indigo-600/15 blur-3xl" />
            <div className="relative rounded-[2rem] border border-white/80 bg-white/90 p-6 shadow-2xl shadow-slate-200/70 backdrop-blur sm:p-8">
              <div className="mb-8 text-center lg:text-left">
                <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/25 lg:mx-0">
                  <ShieldCheck className="size-6" />
                </div>
                <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
                  Welcome back
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Sign in to continue managing activity, security, and workspace
                  settings.
                </p>
              </div>

              <AuthForm
                action={loginAction}
                submitClassName="h-12 w-full rounded-xl bg-indigo-600 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-700"
                submitLabel={
                  <>
                    Sign in
                    <ArrowRight className="size-4" />
                  </>
                }
              >
                <div className="space-y-2">
                  <label
                    className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500"
                    htmlFor="email"
                  >
                    Email address
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="curator@stery.com"
                    className="h-12 rounded-xl border-slate-200 bg-white px-4 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-indigo-500 focus-visible:ring-indigo-500/20"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-4">
                    <label
                      className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500"
                      htmlFor="password"
                    >
                      Password
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-xs font-semibold text-indigo-600 transition hover:text-indigo-700"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    placeholder="••••••••"
                    className="h-12 rounded-xl border-slate-200 bg-white px-4 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-indigo-500 focus-visible:ring-indigo-500/20"
                  />
                </div>

                <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm font-medium text-slate-600">
                  <input
                    name="remember"
                    type="checkbox"
                    className="size-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/30"
                    defaultChecked
                  />
                  Keep me signed in for 30 days
                </label>
              </AuthForm>

              <div className="my-7 flex items-center gap-4">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="text-xs font-bold uppercase tracking-[0.28em] text-slate-400">
                  Or continue with
                </span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <Button
                  variant="outline"
                  className="h-11 rounded-xl border-slate-200 bg-white text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
                >
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="size-4"
                  >
                    <path
                      fill="#EA4335"
                      d="M12 10.2v3.9h5.4c-.2 1.3-1.5 3.9-5.4 3.9-3.2 0-5.9-2.7-5.9-6s2.7-6 5.9-6c1.8 0 3.1.8 3.8 1.4l2.6-2.5C16.7 3.4 14.6 2.5 12 2.5 6.9 2.5 2.8 6.6 2.8 11.7S6.9 20.9 12 20.9c6.9 0 8.6-4.8 8.6-7.2 0-.5 0-.9-.1-1.3H12Z"
                    />
                    <path
                      fill="#34A853"
                      d="M2.8 11.7c0 1.6.6 3.1 1.6 4.3l3-2.3c-.4-.6-.6-1.3-.6-2s.2-1.4.6-2l-3-2.3c-1 1.2-1.6 2.7-1.6 4.3Z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M12 20.9c2.3 0 4.3-.8 5.8-2.3l-2.8-2.2c-.8.6-1.8 1-3 .9-2.4 0-4.5-1.6-5.2-3.8l-3.1 2.4c1.5 2.9 4.5 5 8.3 5Z"
                    />
                    <path
                      fill="#4285F4"
                      d="M20.6 12.4c0-.7-.1-1.3-.2-1.9H12v3.9h4.8c-.2 1.1-.9 2-1.8 2.7l2.8 2.2c1.6-1.5 2.8-3.8 2.8-6.9Z"
                    />
                  </svg>
                  Google
                </Button>
                <Button
                  variant="outline"
                  className="h-11 rounded-xl border-slate-200 bg-white text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
                >
                  <Github className="size-4" />
                  GitHub
                </Button>
              </div>

              <p className="mt-8 text-center text-sm font-medium text-slate-500">
                New to the platform?{" "}
                <Link
                  href="/signup"
                  className="font-bold text-indigo-600 transition hover:text-indigo-700 hover:underline"
                >
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
