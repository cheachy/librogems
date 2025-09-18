import { supabase } from "../lib/supabaseClient.js";

export async function signIn(user, password, role) {
  // 1. Authenticate with Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: user,   // 👈 here "user" must be an email
    password
  });

  if (authError) {
    return { data: null, error: { message: "Login failed, try again" } };
  }

  const userId = authData.user.id;

  // 2. Look up the profile in user_login
  const { data: userRow, error: userError } = await supabase
    .from("user_login")
    .select("*")
    .eq("id", userId) // linked to auth.users.id
    .maybeSingle();

  if (userError || !userRow) {
    return { data: null, error: { message: "User profile not found." } };
  }

  // 3. Check role
  if (userRow.role !== role) {
    return { data: null, error: { message: "Invalid credentialsl." } };
  }

  // 4. Save to localStorage
  localStorage.setItem("user", JSON.stringify(userRow));

  return { data: userRow, error: null };
}


export async function signUp(email, password, role) {
  // 1. Create the user in Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password
  });

  if (authError) {
    return { data: null, error: { message: authError.message } };
  }

  const userId = authData.user.id;

  // 2. Insert profile into user_login table
  const { data: profile, error: profileError } = await supabase
    .from("user_login")
    .insert([
      {
        id: userId,      // 👈 foreign key to auth.users.id
        email,        // display name
        role             // e.g. "user" or "admin"
      }
    ])

  if (profileError) {
    return { data: null, error: { message: profileError.message } };
  }

  return { data: profile, error: null };
}


export async function getUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
}

