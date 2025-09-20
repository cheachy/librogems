const loginContainer = document.getElementById("login-container");
const signupContainer = document.getElementById("signup-container");

document.getElementById("show-signup").addEventListener("click", (e) => {
  e.preventDefault();
  loginContainer.classList.add("hidden");
  signupContainer.classList.remove("hidden");
});

document.getElementById("show-login").addEventListener("click", (e) => {
  e.preventDefault();
  signupContainer.classList.add("hidden");
  loginContainer.classList.remove("hidden");
});
