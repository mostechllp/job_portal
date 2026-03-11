import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../api/axios";

// Async Thunk for login
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectValue }) => {
    try {
      const response = await API.post("/auth/login", credentials);
      localStorage.setItem("token", response.data.token);
      return response.data;
    } catch (error) {
      return rejectValue(error.response.data.message || "Login failed");
    }
  },
);

// thung to load user data on refresh
export const loadUser = createAsyncThunk(
  "auth/loadUser",
  async (_, {rejectValue}) => {
    try {
      const response = await API.get("/auth/me");
      return response.data;
    } catch (error) {
      localStorage.removeItem("token") // clear invalid token
      return rejectValue(error.response.data.message || "failed loading user")
    }
  }
)

const authSlice = createSlice({
    name: "auth", 
    initialState: {
      user: null,
      token: localStorage.getItem("token") || null,
      loading: false,
      isInitialized: false,
      error: null,
    },
    reducers: {
      signOut: (state) => {
        localStorage.removeItem("token");
        state.user = null;
        state.token = null;
      }
    },
    extraReducers: builder => {
      builder.addCase(loginUser.pending, state => {
        state.loading = true;
      }),
      builder.addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      }),
      builder.addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload
      }),
      builder.addCase(loadUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.loading = false;
        state.isInitialized = true;
      }),
      builder.addCase(loadUser.rejected, state => {
        state.user = null;
        state.loading = false;
        state.token = null;
        state.isInitialized = true;
      })
    }
})

export const {signOut} = authSlice.actions;
export default authSlice.reducer;
