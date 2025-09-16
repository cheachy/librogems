import { signUp } from "./utils/auth.js";

document.getElementById("signup-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const user = document.getElementById("new-username").value.trim();
  const password = document.getElementById("new-password").value;
  const role = "user";

  const { data, error } = await signUp(user, password, role);

  if (error || !data) {
    alert("Signup failed: " + (error?.message || "Something went wrong"));
  } else {
    alert("Signup successful! Please log in.");
    // After signup, you can redirect back to login
    window.location.href = "student.html";
  }
});
