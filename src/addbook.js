import { addBook } from "./utils/book.js";

const addBookbtn = document.getElementById("addBookbtn");
const modal = document.getElementById("modal");
const closeModal = document.getElementById("closeModal");
const bookForm = document.getElementById("bookForm");
const statusMsg = document.getElementById("statusMsg");

addBookbtn.addEventListener("click", () => {
    modal.style.display = 'block';
});

closeModal.addEventListener("click", () => {
    modal.style.display = 'none';
    bookForm.reset();
    statusMsg.textContent = '';
});

bookForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value.trim();
    const author = document.getElementById("author").value.trim();
    const description = document.getElementById("description").value.trim();
    const p_date = document.getElementById("p_date").value;
    const quantity = Number(document.getElementById("quantity").value);

    const result = await addBook(title, author, description, p_date, quantity);

    if(result.error){
        statusMsg.textContent = `Error:${result.error}`;
    } else {
        statusMsg.textContent = "Book added successfully!";
        bookForm.reset();
    }
});