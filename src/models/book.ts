import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { User } from "./user";
import { RootState } from "../app/store";

export type Book = {
  id: string;
  title: string;
  category: string;
  borrower: string;
  borrowed: boolean;
};

export const fetchBooks = createAsyncThunk("books/fetchBooks", async () => {
  const response = await fetch(`http://localhost:8000/api/books`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  return data.map((book: Book & { borrower: string }) => ({
    ...book,
    borrowed: book.borrower !== null,
  }));
});

export const borrowBook = createAsyncThunk(
  "books/borrowBook",
  async (
    { id, return_book = false }: { id: string; return_book?: boolean },
    { getState }
  ) => {
    const response = await fetch(
      `http://localhost:8000/api/${return_book ? "return" : "borrow"}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          book_id: id,
        }),
      }
    );
    if (response.status === 200) {
      return (getState() as { books: Book[] }).books.map((book: Book) => ({
        ...book,
        borrower:
          id == book.id
            ? return_book
              ? null
              : (getState() as any).user.id
            : book.borrower,
        borrowed: id == book.id ? !return_book : book.borrowed,
      }));
    }
    return (getState() as { books: Book[] }).books;
  }
);

const booksSlice = createSlice({
  name: "books",
  initialState: [] as Book[],
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchBooks.fulfilled, (state, action) => {
      console.log("fetchBooks/fulfilled");
      console.log(action.payload);
      return action.payload;
    });
    builder.addCase(fetchBooks.rejected, (state, action) => {
      console.error("fetchBooks/rejected");
      console.error(action.error);
    });
    builder.addCase(borrowBook.fulfilled, (state, action) => {
      return action.payload;
    });
    builder.addCase(borrowBook.rejected, (state, action) => {
      console.error("borrowBook/rejected");
      console.error(action.error);
    });
  },
});

export default booksSlice.reducer;

export const selectBooks = (state: { books: Book[] }) => state.books;
