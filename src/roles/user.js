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

const logoutBtn = document.querySelector(".logout-btn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", (e) => {
    e.preventDefault(); // prevent "#" from reloading page
    // Optionally clear any saved session data here (localStorage, cookies, etc.)
    window.location.href = "index.html"; // redirect back to login page
  });
}