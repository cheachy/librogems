import { borrowBook, getBooks } from "./utils/book.js";

const bookContainer = document.getElementById("booksContainer");

async function loadBooks () {
    const { data, error } = await getBooks();

    if(error) {
        console.error("Error fetching books: ", error.message);
        bookContainer.innerHTML = `<p>Failed to load books: ${error.message}</p>`;
    }

    if(!data || data.length === 0){
        bookContainer.innerHTML = "<p>No books to display.</p>";
    }

    bookContainer.innerHTML = "";

    data.forEach(book => {
        const card = document.createElement("div");

        card.className = "book-card";

        card.innerHTML = `
            <h3>${book.title}</h3>
            <p><strong>Author:</strong> ${book.author}</p>
            <p><strong>Description:</strong> ${book.description}</p>
            <p><strong>Published:</strong> ${book.p_date}</p>
            <p><strong>Quantity:</strong> ${book.available_copies}</p>
            <p><strong>Status:</strong> ${book.status}</p>
            <button class="rent-btn" ${book.available_copies <= 0 ? "disabled" : ""}>
                ${book.available_copies > 0 ? "Borrow" : "Not Available"}
            </button>`

            bookContainer.appendChild(card);

            const rentBtn = card.querySelector(".rent-btn");
            rentBtn.addEventListener("click", async () => {
            const user = JSON.parse(localStorage.getItem("user"));
            const userId = user?.id;

            if (!userId) {
                alert("❌ You must be logged in to borrow a book.");
                return;
            }

            const { error: borrowError } = await borrowBook(book.id, userId);

            if (borrowError) {
                alert("❌ Could not borrow book: " + borrowError);
                console.error("Borrow error:", borrowError);
            } else {
                alert(`✅ You borrowed "${book.title}"`);
                loadBooks(); // refresh list so available_copies updates
            }
            });
            
    });
}

loadBooks();