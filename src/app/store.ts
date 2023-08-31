import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit"
import userReducer from "../models/user"
import booksReducer from "../models/book"

export const store = configureStore({
  reducer: {
    user: userReducer,
    books: booksReducer,
  },
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
