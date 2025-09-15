import { supabase } from "../lib/supabaseClient.js";

// Sign in against your custom users table
export async function signIn(user, password, role) {
  const { data, error } = await supabase
    .from("user")
    .select("*")
    .eq("username", user)
    .eq("password", password)  // ⚠️ plaintext only for testing
    .eq("role", role)
    .single();

  return { data, error };
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

