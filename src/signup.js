import { signUp } from "./utils/auth.js";

document.getElementById("signup-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("new-email").value.trim();
  const password = document.getElementById("new-password").value;
  const first_name = document.getElementById("new-first_name").value.trim();
  const last_name = document.getElementById("new-last_name").value.trim();
  const nick_name = document.getElementById("new-nick_name").value.trim();
  const role = "user"; // default role, you can make this dynamic later if needed

  const { data, error } = await signUp(email, password, role,first_name,last_name,nick_name);

  if (error) {
    alert("❌ Signup failed: " + error.message);
    return;
  }

  alert("✅ Signup successful! Please check your email to confirm your account.");
  window.location.href = "login.html"; // redirect to login
});
