// utils/books.js
import { supabase } from "../lib/supabaseClient";
import { getUser } from "./auth";

// Fetch all books (anyone logged in can see → Availability)
export async function getBooks() {
  const { data, error } = await supabase.from("books").select("*");
  return { data, error };
}

// Add a new book (admin only → Confidentiality)
export async function addBook(title, author, description, p_date , status) {
  const { user } = await getUser();
  if (!user || user.user_metadata.role !== "admin") {
    return { error: "Not authorized" };
  }
  return await supabase.from("books").insert([{ title, author,description, date_published, available }]);
}

// Borrow a book (only logged-in users → Integrity)
export async function borrowBook(bookId) {
  const { user } = await getUser();
  if (!user) return { error: "You must log in to borrow books" };

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
  const { data, error } = await supabase
    .from("rentals")
    .insert([{ user_id: user.id, book_id: bookId, status: "borrowed" }]);

  if (error) return { error };

  // Decrement availability
  await supabase
    .from("books")
    .update({ available: book.available - 1 })
    .eq("id", bookId);

  return { data };
}

// Return a book (user can only return their own → Confidentiality + Integrity)
export async function returnBook(rentalId) {
  const { user } = await getUser();
  if (!user) return { error: "You must log in to return books" };

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
