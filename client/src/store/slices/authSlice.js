import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../api/axios";

// Async Thunk for login
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await API.post("/auth/login", credentials);
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
      if (response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      return rejectWithValue(message);
    }
  },
);

// thunk to load user data on refresh
export const loadUser = createAsyncThunk(
  "auth/loadUser",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      if (!token) {
        return rejectWithValue("No token found");
      }
      const response = await API.get("/auth/me");
      return response.data;
    } catch (error) {
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
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      if (response.data.user) {
        // Make sure profileImg is included
        const userToSave = {
          ...response.data.user,
          _id: response.data.user.id || response.data.user._id,
          profileImg: response.data.user.profileImg || null,
        };
        localStorage.setItem("user", JSON.stringify(userToSave));
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
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Admin login failed";
      return rejectWithValue(message);
    }
  },
);

const initialState = {
  user: (() => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
      // eslint-disable-next-line no-unused-vars
    } catch (e) {
      return null;
    }
  })(),
  token: localStorage.getItem("token") || null,
  loading: false,
  isInitialized: false,
  error: null,
  isSignedIn: !!localStorage.getItem("token"),
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isSignedIn = true;

      // Update localStorage
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },
    signOut: (state) => {
      state.user = null;
      state.token = null;
      state.isInitialized = true;
      state.isSignedIn = false;

      // Also clear localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    updateUserProfileImage: (state, action) => {
      if (state.user) {
        state.user.profileImg = action.payload;
        // Update localStorage with new image URL
        localStorage.setItem("user", JSON.stringify(state.user));
      }
    },
    setInitialized: (state) => {
      state.isInitialized = true;
    },
    rehydrate: (state, action) => {
      // This will be called when redux-persist restores the state
      if (action.payload) {
        state.user = action.payload.user || null;
        state.token = action.payload.token || null;
      }
      state.isInitialized = true;
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
        const userData = action.payload.user;
        state.user = {
          ...userData,
          _id: userData.id || userData._id,
        };
        state.token = action.payload.token;
        state.isInitialized = true;
        state.error = null;
        state.isSignedIn = true;
        localStorage.getItem("token");
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isInitialized = true;
      })

      // Load User
      .addCase(loadUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        const userData = action.payload.user || action.payload;

        state.user = {
          ...userData,
          _id: userData.id || userData._id,
        };
        state.loading = false;
        state.isInitialized = true;
        state.isSignedIn = true;
        state.error = null;
      })
      .addCase(loadUser.rejected, (state, action) => {
        state.loading = false;
        state.isInitialized = true;
        state.isSignedIn = false;
        state.error = action.payload;
      })

      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.isInitialized = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.isInitialized = true;
        state.error = action.payload;
      })

      // Verify OTP
      .addCase(verifyOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.token) {
          state.token = action.payload.token;
        }
        if (action.payload.user) {
          state.user = {
            ...action.payload.user,
            _id: action.payload.user.id || action.payload.user._id,
          };
        }
        state.isInitialized = true;
        state.isSignedIn = true;
        state.error = null;
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.loading = false;
        state.isInitialized = true;
        state.error = action.payload;
      })

      // Resend OTP
      .addCase(resendOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resendOTP.fulfilled, (state) => {
        state.loading = false;
        state.isInitialized = true;
        state.error = null;
      })
      .addCase(resendOTP.rejected, (state, action) => {
        state.loading = false;
        state.isInitialized = true;
        state.error = action.payload;
      })

      // Forgot Password
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
        state.isInitialized = true;
        state.error = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.isInitialized = true;
        state.error = action.payload;
      })

      // Verify Reset OTP
      .addCase(verifyResetOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyResetOTP.fulfilled, (state) => {
        state.loading = false;
        state.isInitialized = true;
        state.error = null;
      })
      .addCase(verifyResetOTP.rejected, (state, action) => {
        state.loading = false;
        state.isInitialized = true;
        state.error = action.payload;
      })

      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        state.isInitialized = true;
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.isInitialized = true;
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

export const { signOut, updateUserProfileImage, setInitialized, rehydrate } =
  authSlice.actions;
export default authSlice.reducer;
