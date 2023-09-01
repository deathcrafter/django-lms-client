import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Book } from "./book";
import { RootState } from "../app/store";

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  college: string;
  books: Omit<Book, "borrowed">[];
};

export const signIn = createAsyncThunk(
  "user/signIn",
  async ({ id, password }: { id: string; password: string }) => {
    const response = await fetch(`http://localhost:8000/auth/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, password }),
    });
    const data = await response.json();
    if (response.status === 200) {
      localStorage.setItem("token", data.token);
      return data.user;
    } else {
      throw new Error(data.message);
    }
  }
);

export const fetchUser = createAsyncThunk("user/fetchUser", async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token");
  }
  const response = await fetch(`http://localhost:8000/api/user`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (response.status === 200) {
    return data;
  } else {
    throw new Error(data.message);
  }
});

const userSlice = createSlice({
  name: "user",
  initialState: {
    id: "",
    name: "",
    email: "",
    phone: "",
    address: "",
    college: "",
    books: [],
  } as User,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      return { ...state, ...action.payload };
    },
    clearUser: () => {
      localStorage.removeItem("token");
      return {
        id: "",
        name: "",
        email: "",
        phone: "",
        address: "",
        college: "",
        books: [],
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUser.fulfilled, (_, action) => {
      return action.payload;
    });
    builder.addCase(fetchUser.rejected, (_, action) => {
      console.error("fetchUser/rejected");
      console.error(action.error);
    });
    builder.addCase(signIn.fulfilled, (_, action) => {
      return action.payload;
    });
    builder.addCase(signIn.rejected, (_, action) => {
      console.error("signIn/rejected");
      console.error(action.error);
    });
  },
});

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const response = await fetch(`http://localhost:8000/api/users`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  if (response.status === 200) {
    return data;
  } else {
    throw new Error(data.message);
  }
});

export const usersSlice = createSlice({
  name: "users",
  initialState: [] as User[],
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUsers.fulfilled, (_, action) => {
      return action.payload;
    });
    builder.addCase(fetchUsers.rejected, (_, action) => {
      console.error("fetchUsers/rejected");
      console.error(action.error);
    });
  },
});

export const { setUser, clearUser } = userSlice.actions;

export const userReducer = userSlice.reducer;

export const usersReducer = usersSlice.reducer;

export const selectUser = (state: RootState) => state.user;

export const selectUsers = (state: RootState) => state.users;
