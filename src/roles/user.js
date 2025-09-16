// student.js

const params = new URLSearchParams(window.location.search);
const username = params.get("username");
const role = params.get("role");

const usernameElement = document.getElementById("username");

// Update the text content
if (usernameElement && username) {
  usernameElement.textContent = `Hello ${username}! You are logged in as ${role}.`;
}

document.getElementById("getBooksBtn").addEventListener("click", () => {
  window.location.href = "booklist.html";
});