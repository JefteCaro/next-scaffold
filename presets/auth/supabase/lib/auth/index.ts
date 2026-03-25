import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";

import { createServerSupabase } from "@/lib/supabase/server";

import type { AuthUser } from "./types";

export type { AuthUser } from "./types";

function mapSupabaseUser(user: User): AuthUser {
  const meta = user.user_metadata ?? {};
  return {
    id: user.id,
    email: user.email ?? "",
    firstName: typeof meta.first_name === "string" ? meta.first_name : "",
    lastName: typeof meta.last_name === "string" ? meta.last_name : "",
    workspaceName: typeof meta.workspace_name === "string" ? meta.workspace_name : "",
    role: typeof meta.role === "string" ? meta.role : "Administrator",
    createdAt: user.created_at ?? "",
    updatedAt: user.updated_at ?? "",
    lastLoginAt: user.last_sign_in_at ?? undefined,
  };
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  return mapSupabaseUser(user);
}

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function requireGuest() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/");
  }
}

export async function logout() {
  const supabase = await createServerSupabase();
  await supabase.auth.signOut();
}
