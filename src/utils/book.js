// utils/books.js
import { supabase } from "../lib/supabaseClient";

// Fetch all books (anyone logged in can see → Availability)
export async function getBooks() {
  const { data, error } = await supabase.from("book").select("*");
  return { data, error };
}

// Add a new book (admin only → Confidentiality)
export async function addBook(title, author, description, p_date, quantity) {
  const { data, error } = await supabase
    .from("book") // ✅ singular, as you said
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
export async function borrowBook(bookId,userId  ) {
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

  const {data: borrowRecord, error: borrowError} = await supabase
    .from("borrow_records")
    .insert([{user_id: userId,book_id : bookId}])


  if(borrowError) return {error: borrowError.message};

  const {error: updateError} = await supabase
    .from("book")
    .update({available_copies: book.available_copies - 1})
    .eq("id",bookId);

  return { data: borrowRecord };
} 

// Return a book (user can only return their own → Confidentiality + Integrity)
export async function returnBook(rentalId) {
  // Check rental ownership
  const { data: rental } = await supabase
    .from("rentals")
    .select("*")
    .eq("id", rentalId)
    .eq("user_id", user.id)
    .single();

  if (!rental) return { error: "Not authorized to return this rental" };

  // Update rental
  await supabase
    .from("rentals")
    .update({ status: "returned", returned_at: new Date().toISOString() })
    .eq("id", rentalId);

  // Increase book availability
  const { data: book } = await supabase
    .from("books")
    .select("available")
    .eq("id", rental.book_id)
    .single();

  if (book) {
    await supabase
      .from("books")
      .update({ available: book.available + 1 })
      .eq("id", rental.book_id);
  }

  return { success: true };
}
