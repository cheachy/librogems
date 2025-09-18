import { addBook } from "./utils/book.js";

const addBookbtn = document.getElementById("addBookbtn");
const modal = document.getElementById("modal-overlay");
const closeModal = document.getElementById("closeModal");
const bookForm = document.getElementById("bookForm");
const statusMsg = document.getElementById("statusMsg");

addBookbtn.addEventListener("click", () => {
    modal.classList.remove("hidden");
    modal.classList.add("visible");
});

closeModal.addEventListener("click", () => {
    modal.classList.remove("visible");
    modal.classList.add("hidden");
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