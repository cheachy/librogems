import { supabase } from "../lib/supabaseClient.js";

export async function signIn(user, password, role) {
  // 1) Find by username first to distinguish errors
  const { data: userRow, error: findError } = await supabase
    .from("user")
    .select("*")
    .eq("username", user)
    .eq("password", password)  // ⚠️ plaintext only for testing
    .eq("role", role)
    .single();

  if (findError) {
    return { data: null, error: { message: "Login failed: Please try again." } };
  }

  if (!userRow) {
    return { data: null, error: { message: "invalid username" } };
  }

  if (userRow.password !== password) {
    return { data: null, error: { message: "password incorrect" } };
  }

  if (role && userRow.role !== role) {
    return { data: null, error: { message: "invalid credentials" } };
  }

  // If all checks pass, return the user data
  return { data: userRow, error: null };
}

export async function signUp(user, password, role) {
  // 1. Check if username exists
  const { data: existingUser, error: existingError } = await supabase
    .from("user")
    .select("id")
    .eq("username", user)
    .maybeSingle();

  if (existingUser) {
    return { data: null, error: { message: "Username already taken" } };
  }

  // 2. If no user found, insert new one
  const { data, error } = await supabase
    .from("user")
    .insert([{ username: user, password, role }])
    .select()
    .single();

  return { data, error };
}

export async function getUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
}

