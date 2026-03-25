import Link from "next/link";
import ArrowRight from "@/components/icons/heroicons/outline/arrow-right";
import UserPlus from "@/components/icons/heroicons/outline/user-plus";
import CheckCircle from "@/components/icons/heroicons/outline/check-circle";
import ShieldCheck from "@/components/icons/heroicons/outline/shield-check";
import Sparkles from "@/components/icons/heroicons/outline/sparkles";
import Key from "@/components/icons/heroicons/outline/key";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { requireGuest } from "@/lib/auth";

import { signupAction } from "../auth-actions";
import { AuthForm } from "../auth-forms";

export const dynamic = "force-dynamic";

const onboardingHighlights = [
  { label: "Workspaces launched", value: "640+" },
  { label: "Security policies", value: "128" },
  { label: "Average setup time", value: "6 min" },
];

const planBenefits = [
  "Provision secure workspaces with role-based access from day one",
  "Route approvals and audit history into a single operator dashboard",
  "Keep teams aligned with reusable security and governance templates",
];

export default async function SignupPage() {
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
              Already have an account?
            </span>
            <Button
              variant="outline"
              className="h-10 rounded-xl border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
              render={<Link href="/login" />}
            >
              Sign in
            </Button>
          </div>
        </header>

        <section className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-[1.1fr_480px] lg:gap-16 lg:py-16">
          <div className="hidden lg:block">
            <div className="max-w-xl space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white/80 px-4 py-2 text-sm font-semibold text-indigo-700 shadow-sm backdrop-blur">
                <Sparkles className="size-4" />
                Launch operations with confidence
              </div>

              <div className="space-y-4">
                <h1 className="text-5xl font-extrabold leading-tight tracking-tight text-slate-950">
                  Create a workspace designed for calm, controlled growth.
                </h1>
                <p className="max-w-lg text-lg leading-8 text-slate-600">
                  Start with the same clean experience as login, then bring
                  teammates, approvals, and compliance checks into one polished
                  dashboard from day one.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {onboardingHighlights.map((item) => (
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
                    <UserPlus className="size-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Setup preview
                    </p>
                    <h2 className="text-xl font-bold tracking-tight text-slate-900">
                      Everything your team needs to begin securely
                    </h2>
                  </div>
                </div>

                <ul className="mt-6 space-y-4">
                  {planBenefits.map((benefit) => (
                    <li
                      key={benefit}
                      className="flex items-start gap-3 text-sm leading-6 text-slate-600"
                    >
                      <span className="mt-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-700">
                        <CheckCircle className="size-3.5" />
                      </span>
                      <span>{benefit}</span>
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
                  <UserPlus className="size-6" />
                </div>
                <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
                  Create your account
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Set up your operator profile and spin up a secure dashboard
                  workspace in minutes.
                </p>
              </div>

              <AuthForm
                action={signupAction}
                submitClassName="h-12 w-full rounded-xl bg-indigo-600 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-700"
                submitLabel={
                  <>
                    Create account
                    <ArrowRight className="size-4" />
                  </>
                }
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label
                      className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500"
                      htmlFor="firstName"
                    >
                      First name
                    </label>
                    <Input
                      id="firstName"
                      name="firstName"
                      autoComplete="given-name"
                      required
                      placeholder="Jeff"
                      className="h-12 rounded-xl border-slate-200 bg-white px-4 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-indigo-500 focus-visible:ring-indigo-500/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500"
                      htmlFor="lastName"
                    >
                      Last name
                    </label>
                    <Input
                      id="lastName"
                      name="lastName"
                      autoComplete="family-name"
                      required
                      placeholder="Operator"
                      className="h-12 rounded-xl border-slate-200 bg-white px-4 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-indigo-500 focus-visible:ring-indigo-500/20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500"
                    htmlFor="email"
                  >
                    Work email
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
                  <label
                    className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500"
                    htmlFor="workspaceName"
                  >
                    Workspace name
                  </label>
                  <Input
                    id="workspaceName"
                    name="workspaceName"
                    required
                    placeholder="Stery Operations"
                    className="h-12 rounded-xl border-slate-200 bg-white px-4 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-indigo-500 focus-visible:ring-indigo-500/20"
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label
                      className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500"
                      htmlFor="password"
                    >
                      Password
                    </label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      required
                      placeholder="••••••••"
                      className="h-12 rounded-xl border-slate-200 bg-white px-4 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-indigo-500 focus-visible:ring-indigo-500/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500"
                      htmlFor="confirmPassword"
                    >
                      Confirm password
                    </label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      required
                      placeholder="••••••••"
                      className="h-12 rounded-xl border-slate-200 bg-white px-4 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-indigo-500 focus-visible:ring-indigo-500/20"
                    />
                  </div>
                </div>

                <label className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm font-medium leading-6 text-slate-600">
                  <input
                    name="acceptTerms"
                    type="checkbox"
                    className="mt-1 size-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/30"
                    defaultChecked
                  />
                  <span>
                    I agree to the{" "}
                    <Link
                      href="/terms"
                      className="font-semibold text-indigo-600 hover:text-indigo-700"
                    >
                      Terms
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      className="font-semibold text-indigo-600 hover:text-indigo-700"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </span>
                </label>
              </AuthForm>

              <p className="mt-8 text-center text-sm font-medium text-slate-500">
                Already onboarded?{" "}
                <Link
                  href="/login"
                  className="font-bold text-indigo-600 transition hover:text-indigo-700 hover:underline"
                >
                  Sign in instead
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
