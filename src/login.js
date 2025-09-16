import { signIn } from "./utils/auth.js";

document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const user = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  const role = document.getElementById("role").value;
  const usernameErrorEl = document.getElementById("username-error");
  const passwordErrorEl = document.getElementById("password-error");

  // Reset error messages
  if (usernameErrorEl) usernameErrorEl.classList.add("hidden");
  if (passwordErrorEl) passwordErrorEl.classList.add("hidden");

  const { data, error } = await signIn(user, password, role);

  if (error) {
    // Handle specific error types
    if (error.message === "Username is not registered, sign up now.") {
      if (usernameErrorEl) {
        usernameErrorEl.textContent = error.message;
        usernameErrorEl.classList.remove("hidden");
      }
    } else if (error.message === "Password incorrect." || error.message === "Invalid credentials.") {
      if (passwordErrorEl) {
        passwordErrorEl.textContent = error.message;
        passwordErrorEl.classList.remove("hidden");
      }
    } else {
      
    }
  } else {
    alert(`Login successful as ${data.role}`);
    window.location.href = `${data.role}.html?username=${encodeURIComponent(data.username)}&role=${data.role}`;
  }
});