import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ArrowRight from "@/components/icons/heroicons/outline/arrow-right";
import Clock from "@/components/icons/heroicons/outline/clock";
import Envelope from "@/components/icons/heroicons/outline/envelope";
import ShieldCheck from "@/components/icons/heroicons/outline/shield-check";
import Sparkles from "@/components/icons/heroicons/outline/sparkles";

import { forgotPasswordAction } from "../auth-actions";
import { AuthForm } from "../auth-forms";

const recoveryStats = [
  { label: "Average recovery time", value: "< 5 min" },
  { label: "Protected workspaces", value: "640+" },
  { label: "Verification coverage", value: "24/7" },
];

const recoveryNotes = [
  "Password reset links are time-bound and signed for device-safe recovery",
  "Operators keep security policies, audit history, and workspace sessions intact",
  "Support teams can verify recovery events without exposing sensitive credentials",
];

export default function ForgotPasswordPage() {
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
              Remembered it?
            </span>
            <Button
              variant="outline"
              className="h-10 rounded-xl border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
              render={<Link href="/login" />}
            >
              Back to sign in
            </Button>
          </div>
        </header>

        <section className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-[1.1fr_480px] lg:gap-16 lg:py-16">
          <div className="hidden lg:block">
            <div className="max-w-xl space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white/80 px-4 py-2 text-sm font-semibold text-indigo-700 shadow-sm backdrop-blur">
                <Sparkles className="size-4" />
                Calm, verified account recovery
              </div>

              <div className="space-y-4">
                <h1 className="text-5xl font-extrabold leading-tight tracking-tight text-slate-950">
                  Recover access without disrupting the flow of work.
                </h1>
                <p className="max-w-lg text-lg leading-8 text-slate-600">
                  The refreshed auth experience extends to recovery too: clear
                  instructions, high trust signals, and a secure path back into
                  your workspace.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {recoveryStats.map((item) => (
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
                    <Envelope className="size-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Recovery assurance
                    </p>
                    <h2 className="text-xl font-bold tracking-tight text-slate-900">
                      A reset flow built for secure operators
                    </h2>
                  </div>
                </div>

                <ul className="mt-6 space-y-4">
                  {recoveryNotes.map((note) => (
                    <li
                      key={note}
                      className="flex items-start gap-3 text-sm leading-6 text-slate-600"
                    >
                      <span className="mt-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-700">
                        <ShieldCheck className="size-3.5" />
                      </span>
                      <span>{note}</span>
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
                  <Clock className="size-6" />
                </div>
                <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
                  Forgot your password?
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Enter the email tied to your account and we’ll send a secure
                  reset link right away.
                </p>
              </div>

              <AuthForm
                action={forgotPasswordAction}
                submitClassName="h-12 w-full rounded-xl bg-indigo-600 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-700"
                submitLabel={
                  <>
                    Send reset link
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

                <div className="rounded-2xl border border-indigo-100 bg-indigo-50/80 px-4 py-4 text-sm leading-6 text-indigo-900">
                  We’ll email a one-time reset link with a short expiration
                  window to keep your workspace protected.
                </div>
              </AuthForm>

              <p className="mt-8 text-center text-sm font-medium text-slate-500">
                Need to try again?{" "}
                <Link
                  href="/login"
                  className="font-bold text-indigo-600 transition hover:text-indigo-700 hover:underline"
                >
                  Return to sign in
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
