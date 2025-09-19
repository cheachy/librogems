import { signOut } from "../utils/auth.js";

const user = JSON.parse(localStorage.getItem("user"));

const usernameElement = document.getElementById("username");
const usernameGreeting = document.getElementById("greeting");
const userEmail = document.getElementById("email_address");

// Update the text content
if (user && usernameElement) {
  usernameElement.textContent = `${user.first_name} ${user.last_name}`;
  usernameGreeting.textContent = `Welcome, ${user.nick_name}!`;
  userEmail.textContent = `${user.email}`;
}

const logoutBtn = document.querySelector(".logout-btn");

logoutBtn.addEventListener("click", async () => {
  const {error} =await signOut();
  if(error) {
    alert("Failed to log out: " + error.message)
  } else {
    window.location.href ="login.html";
  }
})

