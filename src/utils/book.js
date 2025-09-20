import { supabase } from "../lib/supabaseClient";

// Fetch all books (anyone logged in can see → Availability)
export async function getBooks() {
  const { data, error } = await supabase.from("book").select("*");
  return { data, error };
}

// Add a new book (admin only → Confidentiality)
export async function addBook(title, author, description, p_date, quantity) {
  const { data, error } = await supabase
    .from("book") 
    .insert([{
      title,
      author,
      description,
      p_date,
      total_copies: quantity, 
      available_copies: quantity
    }])


  if (error) {
    console.error("Add book error:", error.message, error.details);
    return { error };
  }

  return { data };
}


// Borrow a book (only logged-in users → Integrity)
export async function borrowBook(bookId,userId) {
  // check availability before inserting → Integrity
  const { data: book , error:  bookError} = await supabase
    .from("book")
    .select("available_copies")
    .eq("id", bookId)
    .single();

  if(bookError) return {error: "Error checking book"};
  if(!book || book.available_copies <= 0){
    return {error: "Book not available"};
  }

  //insert borrow record
  const {data: borrowRecord, error: borrowError} = await supabase
    .from("borrow_records")
    .insert([{borrower_id: userId, book_id : bookId}])


  if(borrowError) return {error: borrowError.message};

  const {error: updateError} = await supabase
    .from("book")
    .update({available_copies: book.available_copies - 1})
    .eq("id",bookId);

  if(updateError) return {error: updateError.message}

  return { data: borrowRecord };
} 

// Return a book (user can only return their own → Confidentiality + Integrity)
export async function returnBook(transactionId,bookId) {
  // Check rental ownership
  const { error: borrowError } = await supabase
    .from("borrow_records")
    .update({
      status: "returned",
      return_date: new Date().toISOString()
    })
    .eq("transaction_id",transactionId)

  if (borrowError) return { error: borrowError.message };

  const {data: book, error: bookError} = await supabase
    .from("book")
    .select("available_copies")
    .eq("id",bookId)
    .single();

  
  if(bookError) return {error: bookError.message};

  const {error: updateError} = await supabase
    .from("book")
    .update({available_copies: book.available_copies + 1})
    .eq("id",bookId);

  if(updateError) return {error: updateError.message};
  
  return {data: "Book returned successfully"};
}

export async function getBorrowedBooks(userId) {
  // Select from borrow_records + join with book table
  const { data, error } = await supabase
    .from("borrow_records")
    .select(`
      transaction_id,
      borrow_date,
      return_date,
      status,
      book:book_id ( id, title, author, description, p_date )
    `)
    .eq("borrower_id", userId);

  return { data, error };
}

// export async function loadTransactions() {
//   const { data, error } = await supabase
//     .from("borrow_records")
//     .select(`
//       transaction_id,
//       user_login ( first_name, last_name ),
//       book ( title ),
//       borrow_date,
//       return_date,
//       status
//     `);

//   if (error) {
//     console.error("Error fetching transactions:", error);
//     return [];
//   }

//   return data;
// }