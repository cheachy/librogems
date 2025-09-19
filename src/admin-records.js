import { supabase } from "../src/lib/supabaseClient.js"

const transactionBody = document.getElementById("transactionBody");

// fetch all records
async function loadTransactions() {
  const { data, error } = await supabase
    .from("borrow_records")
    .select(`
      transaction_id,
      user_login: borrower_id ( 
        first_name,
        last_name ),
      book: book_id ( title ),
      borrow_date,
      return_date,
      status
    `);

  transactionBody.innerHTML = "";

  let totalBooks = data.length;
  let pendingReturns = 0; 

  data.forEach(row => {
    const tr = document.createElement("tr");

    if (row.status === "borrowed") pendingReturns++;

    const borrow_date = new Date(row.borrow_date).toLocaleDateString();

    const return_date = row.return_date ? new Date(row.return_date).toLocaleDateString(): "Not Returned";

    const status = row.status === 'borrowed' ? "Borrowed": "Returned";

    tr.innerHTML = `
      <td>${row.transaction_id}</td>
      <td>${row.user_login?.first_name} ${row.user_login?.last_name}</td>
      <td>${row.book?.title ?? ""}</td>
      <td>${borrow_date}</td>
      <td>${return_date}</td>
      <td>${status}</td>
    `;

    transactionBody.appendChild(tr);
  });

  document.getElementById("total-books-count").textContent = totalBooks;
  document.getElementById("pending-returns-count").textContent = pendingReturns;
}


loadTransactions();