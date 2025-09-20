import { supabase } from "../lib/supabaseClient.js";

export async function signIn(email, password, role) {
  // 1. Authenticate with Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: email,   
    password,

  });

  if (authError) {
    return { data: null, error: { message: "Invalid email or password." } };
  }
  // 2. Look up the profile in user_login
  const { data: userRow, error: userError } = await supabase
    .from("user_login")
    .select("*")
    .eq("id", authData.user.id) // linked to auth.users.id
    .eq("role",role)
    .maybeSingle();

  if (userError || !userRow) {
    return { data: null, error: { message: "Invalid credentials." } };
  }


  // 4. Save to localStorage
  localStorage.setItem("user", JSON.stringify(userRow));

  return { data: userRow, error: null };
}


export async function signUp(email, password, role,first_name,last_name,nick_name) {
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
        id: userId,      // foreign key to auth.users.id
        email,        
        role,             
        first_name: first_name,
        last_name: last_name,
        nick_name: nick_name
        
      }
    ])

  if (profileError) {
    return { data: null, error: { message: profileError.message } };
  }

  return { data: profile, error: null };
}


export async function signOut() {
  const {error} = await supabase.auth.signOut();

  if(error){
    console.error("Error signing out:", error.message);
    return {error};
  }

  localStorage.removeItem("user");

  return {error: null};
}