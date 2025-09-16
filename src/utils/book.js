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
export async function borrowBook(bookId) {
  // check availability before inserting → Integrity
  const { data: book } = await supabase
    .from("books")
    .select("available")
    .eq("id", bookId)
    .single();

  if (!book || book.available <= 0) {
    return { error: "Book not available" };
  }

  // Insert rental

  // Decrement availability
  await supabase
    .from("books")
    .update({ available: book.available - 1 })
    .eq("id", bookId);

  return { data };
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
