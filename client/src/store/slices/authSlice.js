import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../api/axios";

// Async Thunk for login
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await API.post("/auth/login", credentials);
      localStorage.setItem("token", response.data.token);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      return rejectWithValue(message);
    }
  },
);

// thung to load user data on refresh
export const loadUser = createAsyncThunk(
  "auth/loadUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("/auth/me");
      return response.data;
    } catch (error) {
      localStorage.removeItem("token"); 
      return rejectWithValue(
        error.response?.data?.message || "failed loading user",
      );
    }
  },
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await API.post("/auth/register", userData);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Registration failed",
      );
    }
  },
);

export const verifyOTP = createAsyncThunk(
  "auth/verifyOTP",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const response = await API.post("/auth/verify-otp", { email, otp });
      // If verification returns token, store it
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Verification failed",
      );
    }
  },
);

export const resendOTP = createAsyncThunk(
  "auth/resendOTP",
  async (email, { rejectWithValue }) => {
    try {
      const response = await API.post("/auth/resend-otp", { email });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  },
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const response = await API.post("/auth/forgot-password", { email });
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to send reset OTP",
      );
    }
  },
);

export const verifyResetOTP = createAsyncThunk(
  "auth/verifyResetOTP",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const response = await API.post("/auth/verify-reset-otp", { email, otp });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Invalid OTP");
    }
  },
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ email, otp, newPassword }, { rejectWithValue }) => {
    try {
      const response = await API.post("/auth/reset-password", {
        email,
        otp,
        newPassword,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to reset password",
      );
    }
  },
);

export const adminLogin = createAsyncThunk(
  "auth/adminLogin",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await API.post("/auth/admin-login", credentials);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("adminToken", response.data.token); // Optional: separate token
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Admin login failed";
      return rejectWithValue(message);
    }
  },
);

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
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Load User
      .addCase(loadUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.loading = false;
        state.isInitialized = true;
        state.error = null;
      })
      .addCase(loadUser.rejected, (state, action) => {
        state.user = null;
        state.loading = false;
        state.token = null;
        state.isInitialized = true;
        state.error = action.payload;
      })

      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Verify OTP
      .addCase(verifyOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.loading = false;
        // If OTP verification returns token/user, store them
        if (action.payload.token) {
          state.token = action.payload.token;
          localStorage.setItem("token", action.payload.token);
        }
        if (action.payload.user) {
          state.user = action.payload.user;
        }
        state.error = null;
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Resend OTP
      .addCase(resendOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resendOTP.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(resendOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Forgot Password
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Verify Reset OTP
      .addCase(verifyResetOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyResetOTP.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(verifyResetOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // admin login
      .addCase(adminLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isInitialized = true;
        state.error = null;
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isInitialized = true;
      });
  },
});

export const { signOut } = authSlice.actions;
export default authSlice.reducer;
