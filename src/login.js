import { supabase } from "./lib/supabaseClient.js";

document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const user = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  const role = document.getElementById("role").value;
  const usernameErrorEl = document.getElementById("username-error");
  const passwordErrorEl = document.getElementById("password-error");

  // Reset error messages
  if (usernameErrorEl) { usernameErrorEl.textContent = ""; usernameErrorEl.classList.add("hidden"); }
  if (passwordErrorEl) { passwordErrorEl.textContent = ""; passwordErrorEl.classList.add("hidden"); }

  // 1) Find by username first to distinguish errors
  const { data: userRow, error: findError } = await supabase
    .from("user")
    .select("username, password, role")
    .eq("username", user)
    .maybeSingle();

  if (findError) {
    alert("Login failed: Please try again.");
    return;
  }

  if (!userRow) {
    if (usernameErrorEl) {
      usernameErrorEl.textContent = "invalid username";
      usernameErrorEl.classList.remove("hidden");
    }
    return;
  }

  if (userRow.password !== password) {
    if (passwordErrorEl) {
      passwordErrorEl.textContent = "password incorrect";
      passwordErrorEl.classList.remove("hidden");
    }
    return;
  }

  if (role && userRow.role !== role) {
    if (passwordErrorEl) {
      passwordErrorEl.textContent = "invalid credentials";
      passwordErrorEl.classList.remove("hidden");
    }
    return;
  }

  alert(`Login successful as ${userRow.role}`);
  const destination = userRow.role === "admin" ? "admin.html" : "user.html";
  window.location.href = `${destination}?username=${encodeURIComponent(userRow.username)}&role=${encodeURIComponent(userRow.role)}`;
});
