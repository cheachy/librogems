import { addBook, getBooks } from "./utils/book.js";

const bookContainer = document.getElementById("booksContainer");

async function loadBooks () {
    const { data, error } = await getBooks();

    console.log("Supabase data:", data);
    console.log("Supabase error:", error);

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
            <p><strong>Status:</strong> ${book.status}</p>`;

            bookContainer.appendChild(card);
            
    });
}

loadBooks();