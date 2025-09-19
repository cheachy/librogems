import { signIn } from "./utils/auth.js";

document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const user = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const role = document.getElementById("role").value;
  const errorNotificationEl = document.getElementById("error-notification");
  const usernameErrorEl = document.getElementById("username-error");
  const passwordErrorEl = document.getElementById("password-error");
  const credentialsErrorEl = document.getElementById("credentials-error");

  // Reset error messages
  if (errorNotificationEl) errorNotificationEl.classList.add("hidden");
  if (usernameErrorEl) usernameErrorEl.classList.add("hidden");
  if (passwordErrorEl) passwordErrorEl.classList.add("hidden");
  if (credentialsErrorEl) credentialsErrorEl.classList.add("hidden");


  const { data, error } = await signIn(user, password, role);

  if (error) {
    // Show the error notification container
    if (errorNotificationEl) errorNotificationEl.classList.remove("hidden");
    
    // Handle specific error types
    if (error.message === "Invalid email or password.") {
      if (usernameErrorEl) {
        usernameErrorEl.textContent = error.message;
        usernameErrorEl.classList.remove("hidden");
      }
    } else if (error.message === "Invalid credentials.") {
      if (credentialsErrorEl) {
        credentialsErrorEl.textContent = error.message;
        credentialsErrorEl.classList.remove("hidden");
      } 
    } else {
      // For any other error, show it in the username error area
      if (usernameErrorEl) {
        usernameErrorEl.textContent = error.message;
        usernameErrorEl.classList.remove("hidden");
      }
    }
  } else {
    window.location.href = `${data.role}.html?email=${encodeURIComponent(data.email)}&role=${data.role}`;
  }
});