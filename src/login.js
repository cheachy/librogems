import { signIn } from "./utils/auth.js";

document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const user = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  const role = document.getElementById("role").value;

  const { data, error } = await signIn(user, password, role);

  if (error || !data) {
    alert("Login failed: " + (error?.message || "Invalid credentials"));
  } else {
    alert(`Login successful as ${data.role}`);
window.location.href = `student.html?username=${encodeURIComponent(data.username)}&role=${data.role}`;
  }
});
