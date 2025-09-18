// student.js

const user = JSON.parse(localStorage.getItem("user"));

const usernameElement = document.getElementById("username");

// Update the text content
if (user && usernameElement) {
  usernameElement.textContent = `Hello ${user.nick_name}! You are logged in as ${role}.`;
}
