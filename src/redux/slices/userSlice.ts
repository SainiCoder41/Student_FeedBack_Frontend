// redux/slices/userSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosClient from "@/utils/axiosClient";

export interface User {
  _id: string;
  FullName: string;
  EndrollmentNumber: string;
  role: "Student" | "Teacher" | "Admin";
}

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error?: string;
}

const initialState: UserState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: undefined,
};

// Login thunk
export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (
    credentials: { EndrollmentNumber: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await axiosClient.post("/user/login", credentials, {
        withCredentials: true, // include cookies
      });
      return res.data.user;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

// Fetch current user from cookie
export const fetchCurrentUser = createAsyncThunk(
  "user/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosClient.post("/user/me", {}, { withCredentials: true });
      return res.data.user;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Not authenticated");
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // loginUser
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(loginUser.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null;
        state.isAuthenticated = false;
      })
      // fetchCurrentUser
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
