import { supabase } from "../src/lib/supabaseClient.js"

const transactionBody = document.getElementById("transactionBody");

// fetch all records
async function loadTransactions() {
  const { data, error } = await supabase
    .from("borrow_records")
    .select(`
      transaction_id,
      user_login: borrower_id ( first_name ),
      book: book_id ( title ),
      borrow_date,
      return_date,
      status
    `);

  // clear old rows
  transactionBody.innerHTML = "";

  // loop through results
  data.forEach(row => {
    const tr = document.createElement("tr");

    // example: adjust column names to match your table
    tr.innerHTML = `
      <td>${row.transaction_id}</td>
      <td>${row.user_login?.first_name}</td>
      <td>${row.book?.title ?? ""}</td>
      <td>${row.borrow_date}</td>
      <td>${row.return_date}</td>
      <td>${row.status}</td>
    `;

    transactionBody.appendChild(tr);
  });
}

// load data on page load
loadTransactions();