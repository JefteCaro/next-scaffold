"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { createServerSupabase } from "@/lib/supabase/server";

export type AuthActionState = {
  status: "idle" | "success" | "error";
  message?: string;
};

const DEFAULT_STATE: AuthActionState = { status: "idle" };

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function readBoolean(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

async function getAppOrigin() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "http";

  if (host) {
    return `${proto}://${host}`;
  }

  return process.env.NEXT_PUBLIC_APP_URL?.trim() || "http://localhost:3000";
}

function supabaseAuthMessage(message: string) {
  if (message.includes("Invalid login credentials")) {
    return "Invalid email or password.";
  }

  return message;
}

export async function loginAction(
  _prevState: AuthActionState = DEFAULT_STATE,
  formData: FormData,
): Promise<AuthActionState> {
  const email = readString(formData, "email");
  const password = readString(formData, "password");

  if (!email || !password) {
    return { status: "error", message: "Email and password are required." };
  }

  const supabase = await createServerSupabase();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return {
      status: "error",
      message: supabaseAuthMessage(error.message),
    };
  }

  redirect("/");
}

export async function signupAction(
  _prevState: AuthActionState = DEFAULT_STATE,
  formData: FormData,
): Promise<AuthActionState> {
  const firstName = readString(formData, "firstName");
  const lastName = readString(formData, "lastName");
  const email = readString(formData, "email");
  const workspaceName = readString(formData, "workspaceName");
  const password = readString(formData, "password");
  const confirmPassword = readString(formData, "confirmPassword");
  const acceptTerms = readBoolean(formData, "acceptTerms");

  if (
    !firstName ||
    !lastName ||
    !email ||
    !workspaceName ||
    !password ||
    !confirmPassword
  ) {
    return {
      status: "error",
      message: "Complete every required field to create your account.",
    };
  }

  if (password !== confirmPassword) {
    return { status: "error", message: "Passwords do not match." };
  }

  if (!acceptTerms) {
    return {
      status: "error",
      message: "You need to accept the terms and privacy policy to continue.",
    };
  }

  const supabase = await createServerSupabase();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
        workspace_name: workspaceName,
      },
    },
  });

  if (error) {
    return {
      status: "error",
      message: error.message,
    };
  }

  const needsConfirm = !data.session;

  return {
    status: "success",
    message: needsConfirm
      ? "Check your inbox to confirm your email, then sign in."
      : "Account created. You can sign in now.",
  };
}

export async function forgotPasswordAction(
  _prevState: AuthActionState = DEFAULT_STATE,
  formData: FormData,
): Promise<AuthActionState> {
  const email = readString(formData, "email");

  if (!email) {
    return {
      status: "error",
      message: "Enter the email address tied to your account.",
    };
  }

  const supabase = await createServerSupabase();
  const origin = await getAppOrigin();
  const redirectTo = `${origin}/auth/callback?next=${encodeURIComponent("/password-reset")}`;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  });

  if (error) {
    return {
      status: "error",
      message: error.message,
    };
  }

  return {
    status: "success",
    message: "If that account exists, a reset link is on the way.",
  };
}

export async function passwordResetAction(
  _prevState: AuthActionState = DEFAULT_STATE,
  formData: FormData,
): Promise<AuthActionState> {
  const password = readString(formData, "password");
  const confirmPassword = readString(formData, "confirmPassword");
  const revokeOtherSessions = readBoolean(formData, "revokeOtherSessions");

  if (!password || !confirmPassword) {
    return { status: "error", message: "Enter and confirm your new password." };
  }

  if (password !== confirmPassword) {
    return { status: "error", message: "The new passwords do not match." };
  }

  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      status: "error",
      message:
        "Your reset session is missing or expired. Request a new link from the forgot password page.",
    };
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return {
      status: "error",
      message: error.message,
    };
  }

  if (revokeOtherSessions) {
    await supabase.auth.signOut({ scope: "others" });
  }

  return {
    status: "success",
    message: "Your password has been updated. You can sign in with it now.",
  };
}
