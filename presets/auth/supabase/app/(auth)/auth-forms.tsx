"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle, CheckCircle2 } from "lucide-react";

import type { AuthActionState } from "./auth-actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

const initialState: AuthActionState = { status: "idle" };

function AuthFeedback({ state }: { state: AuthActionState }) {
  if (state.status === "idle" || !state.message) {
    return null;
  }

  const success = state.status === "success";

  return (
    <Alert
      variant={success ? "default" : "destructive"}
      className={
        success
          ? "border-emerald-200 bg-emerald-50 text-emerald-900"
          : "border-red-200 bg-red-50 text-red-900"
      }
    >
      {success ? (
        <CheckCircle2 className="size-4" />
      ) : (
        <AlertCircle className="size-4" />
      )}
      <AlertTitle>{success ? "Done" : "Something went wrong"}</AlertTitle>
      <AlertDescription
        className={success ? "text-emerald-800" : "text-red-800"}
      >
        {state.message}
      </AlertDescription>
    </Alert>
  );
}

function SubmitButton({
  children,
  className,
}: {
  children: React.ReactNode;
  className: string;
}) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className={className}>
      {pending ? "Working..." : children}
    </Button>
  );
}

export function AuthForm({
  action,
  children,
  submitLabel,
  submitClassName,
}: {
  action: (
    state: AuthActionState,
    formData: FormData,
  ) => Promise<AuthActionState>;
  children: React.ReactNode;
  submitLabel: React.ReactNode;
  submitClassName: string;
}) {
  const [state, formAction] = useActionState(action, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <AuthFeedback state={state} />
      {children}
      <SubmitButton className={submitClassName}>{submitLabel}</SubmitButton>
    </form>
  );
}
