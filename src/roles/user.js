import { signOut } from "../utils/auth.js";
import { getBorrowedBooks ,returnBook} from "../utils/book.js";


const user = JSON.parse(localStorage.getItem("user"));

const usernameElement = document.getElementById("username");
const usernameGreeting = document.getElementById("greeting");
const userEmail = document.getElementById("email_address");
const borrowedDisplay = document.getElementById("borrowed-count");
const returnedDisplay = document.getElementById("returned-count")
let borrowedCount;
let returnedCount;

// Update the text content
if (user && usernameElement) {
  usernameElement.textContent = `${user.first_name} ${user.last_name}`;
  usernameGreeting.textContent = `Welcome, ${user.nick_name}!`;
  userEmail.textContent = `${user.email}`;
}

document.getElementById("getBooksBtn").addEventListener("click", () => {
  window.location.href = "booklist.html";
});

const logoutBtn = document.querySelector(".logout-btn");

logoutBtn.addEventListener("click", async () => {
  const {error} =await signOut();
  if(error) {
    alert("Failed to log out: " + error.message)
  } else {
    window.location.href ="login.html";
  }
})


async function loadBorrowedBooks() {
  const user = JSON.parse(localStorage.getItem("user"));
  const container = document.getElementById("borrowedBooksContainer");

  returnedCount = 0;
  borrowedCount = 0;
  

  if (!user) {
    container.innerHTML = "<p>You must be logged in to see your borrowed books.</p>";
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

   
    if (record.status === "returned"){
      returnedCount += 1;
    }

    if(record.status === "borrowed"){
      borrowedCount += 1; 
    }
    
    

    returnedDisplay.innerText = `${returnedCount}`;
    borrowedDisplay.innerText = `${borrowedCount}`;

    const card = document.createElement("div");
    card.className = "borrow-card";

    card.innerHTML = `
      <h3>${record.book.title}</h3>
      <p><strong>Author:</strong> ${record.book.author}</p>
      <p><strong>Description:</strong> ${record.book.description}</p>
      <p><strong>Borrowed On:</strong> ${new Date(record.borrow_date).toLocaleDateString()}</p>
      <p><strong>Status:</strong> ${record.status}</p>
      <button class="return-btn" data-tid="${record.transaction_id}" data-bid="${record.book.id}" ${record.status === "returned" ?  "disabled" : ""}>
        ${record.status === "borrowed" ?  "Return" : "Returned"}
      </button>
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
