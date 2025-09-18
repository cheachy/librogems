// student.js


import { getBorrowedBooks ,returnBook} from "../utils/book.js";


const user = JSON.parse(localStorage.getItem("user"));

const usernameElement = document.getElementById("username");

// Update the text content
if (user && usernameElement) {
  usernameElement.textContent = `Hello ${user.nick_name}! You are logged in as ${user.role}.`;
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


async function loadBorrowedBooks() {
  const user = JSON.parse(localStorage.getItem("user"));
  const container = document.getElementById("borrowedBooksContainer");

  if (!user) {
    container.innerHTML = "<p>❌ You must be logged in to see your borrowed books.</p>";
    return;
  }

  const { data, error } = await getBorrowedBooks(user.id);

  if (error) {
    container.innerHTML = `<p>Error: ${error.message}</p>`;
    return;
  }

  if (!data || data.length === 0) {
    container.innerHTML = "<p>You have no borrowed books.</p>";
    return;
  }

  container.innerHTML = ""; // clear loading text

  data.forEach(record => {
    const card = document.createElement("div");
    card.className = "borrow-card";

    card.innerHTML = `
      <h3>${record.book.title}</h3>
      <p><strong>Author:</strong> ${record.book.author}</p>
      <p><strong>Description:</strong> ${record.book.description}</p>
      <p><strong>Borrowed On:</strong> ${new Date(record.borrow_date).toLocaleDateString()}</p>
      <p><strong>Status:</strong> ${record.status}</p>
      ${record.status === "borrowed" ? `<button class="return-btn" data-tid="${record.transaction_id}" data-bid="${record.book.id}" >Return</button>` : ""}
    `;

    container.appendChild(card);

    // attach event handler if still borrowed
    if (record.status === "borrowed") {
      const returnBtn = card.querySelector(".return-btn");
      returnBtn.addEventListener("click", async () => {
        const transactionId = parseInt(returnBtn.dataset.tid,10)
        const bookId = parseInt(returnBtn.dataset.bid,10);

        const {error } = await returnBook(transactionId,bookId);

        if (error) {
          alert("❌ Failed to return: " + error);
        } else {
          alert("✅ Returned successfully!");
          loadBorrowedBooks(); // refresh UI
        }
      });
    }
  });
}




loadBorrowedBooks();
