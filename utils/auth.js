// utils/auth.js
import { supabase } from "../lib/supabaseClient";

// Sign up
export async function signUp(email, password, role = "user") {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { role } }, // metadata stores role
  });
  return { data, error };
}

// Sign in
export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

// Get current user
export async function getUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
}

// Sign out
export async function signOut() {
  return await supabase.auth.signOut();
}
