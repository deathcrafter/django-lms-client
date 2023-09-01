import { useDispatch, useSelector } from "react-redux";
import { selectBooks, fetchBooks, borrowBook } from "../../models/book";
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useEffect } from "react";
import { AnyAction } from "@reduxjs/toolkit";
import { selectUser } from "../../models/user";

function BooksTable() {
  const books = useSelector(selectBooks);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchBooks() as unknown as AnyAction);
  }, []);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="books table">
        <TableHead>
          <TableRow>
            <TableCell>Sr No.</TableCell>
            <TableCell>Book</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>
              Actions {user.id == "" ? "(login to enable)" : ""}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {books.map((book, index) => (
            <TableRow key={book.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{book.title}</TableCell>
              <TableCell>{book.category}</TableCell>
              <TableCell>
                {book.borrowed ? (
                  book.borrower == user.id ? (
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => {
                        dispatch(
                          borrowBook({
                            id: book.id,
                            return_book: true,
                          }) as unknown as AnyAction
                        );
                      }}
                    >
                      Return
                    </Button>
                  ) : (
                    <Button variant="contained" disabled>
                      Borrowed
                    </Button>
                  )
                ) : (
                  <Button
                    variant="contained"
                    color="success"
                    disabled={user.id == ""}
                    onClick={() => {
                      dispatch(
                        borrowBook({ id: book.id }) as unknown as AnyAction
                      );
                    }}
                  >
                    Borrow
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default function Books() {
  return <BooksTable />;
}
