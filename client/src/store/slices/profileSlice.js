import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/axios";

// Async Thunks
export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get(`/profile`, {
        withCredentials: true,
      });
      return response.data.profile;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch profile",
      );
    }
  },
);

export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await API.put(`/profile`, profileData, {
        withCredentials: true,
      });
      return response.data.profile;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update profile",
      );
    }
  },
);

export const uploadProfileImage = createAsyncThunk(
  "profile/uploadProfileImage",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await API.post("/profile/profile-image", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return {
        profile: response.data.profile,
        user: response.data.user, 
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to upload profile image",
      );
    }
  },
);

export const deleteProfileImage = createAsyncThunk(
  "profile/deleteProfileImage",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.delete("/profile/profile-image", {
        withCredentials: true,
      });
      return {
        profile: response.data.profile,
        user: response.data.user, 
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete profile image",
      );
    }
  },
);

// Skills
export const addSkill = createAsyncThunk(
  "profile/addSkill",
  async (skill, { rejectWithValue }) => {
    try {
      const response = await API.post(
        `/profile/skills`,
        { skill },
        {
          withCredentials: true,
        },
      );
      return response.data.profile;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add skill",
      );
    }
  },
);

export const removeSkill = createAsyncThunk(
  "profile/removeSkill",
  async (skill, { rejectWithValue }) => {
    try {
      const response = await API.delete(
        `/profile/skills/${encodeURIComponent(skill)}`,
        {
          withCredentials: true,
        },
      );
      return response.data.profile;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to remove skill",
      );
    }
  },
);

// Experience
export const addExperience = createAsyncThunk(
  "profile/addExperience",
  async (experienceData, { rejectWithValue }) => {
    try {
      const response = await API.post(`/profile/experience`, experienceData, {
        withCredentials: true,
      });
      return response.data.profile;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add experience",
      );
    }
  },
);

export const updateExperience = createAsyncThunk(
  "profile/updateExperience",
  async ({ experienceId, experienceData }, { rejectWithValue }) => {
    try {
      const response = await API.put(
        `/profile/experience/${experienceId}`,
        experienceData,
        { withCredentials: true },
      );
      return response.data.profile;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update experience",
      );
    }
  },
);

export const deleteExperience = createAsyncThunk(
  "profile/deleteExperience",
  async (experienceId, { rejectWithValue }) => {
    try {
      const response = await API.delete(`/profile/experience/${experienceId}`, {
        withCredentials: true,
      });
      return response.data.profile;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete experience",
      );
    }
  },
);

// Education
export const addEducation = createAsyncThunk(
  "profile/addEducation",
  async (educationData, { rejectWithValue }) => {
    try {
      const response = await API.post(`/profile/education`, educationData, {
        withCredentials: true,
      });
      return response.data.profile;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add education",
      );
    }
  },
);

export const updateEducation = createAsyncThunk(
  "profile/updateEducation",
  async ({ educationId, educationData }, { rejectWithValue }) => {
    try {
      const response = await API.put(
        `/profile/education/${educationId}`,
        educationData,
        { withCredentials: true },
      );
      return response.data.profile;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update education",
      );
    }
  },
);

export const deleteEducation = createAsyncThunk(
  "profile/deleteEducation",
  async (educationId, { rejectWithValue }) => {
    try {
      const response = await API.delete(`/profile/education/${educationId}`, {
        withCredentials: true,
      });
      return response.data.profile;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete education",
      );
    }
  },
);

// Languages
export const addLanguage = createAsyncThunk(
  "profile/addLanguage",
  async (languageData, { rejectWithValue }) => {
    try {
      const response = await API.post(`/profile/languages`, languageData, {
        withCredentials: true,
      });
      return response.data.profile;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add language",
      );
    }
  },
);

export const removeLanguage = createAsyncThunk(
  "profile/removeLanguage",
  async (language, { rejectWithValue }) => {
    try {
      const response = await API.delete(`/profile/languages`, {
        withCredentials: true,
        data: { language },
      });
      return response.data.profile;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to remove language",
      );
    }
  },
);

// Resume
export const uploadResume = createAsyncThunk(
  "profile/uploadResume",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await API.post(`/profile/resume`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data.profile;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to upload resume",
      );
    }
  },
);

export const deleteResume = createAsyncThunk(
  "profile/deleteResume",
  async (publicId, { rejectWithValue }) => {
    try {
      const response = await API.delete(`/profile/resume`, {
        withCredentials: true,
        data: { publicId },
      });
      return response.data.profile;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete resume",
      );
    }
  },
);

const initialState = {
  profile: null,
  loading: false,
  error: null,
  uploadProgress: 0,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearProfileError: (state) => {
      state.error = null;
    },
    setUploadProgress: (state, action) => {
      state.uploadProgress = action.payload;
    },
    clearUploadProgress: (state) => {
      state.uploadProgress = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Profile
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // upload image
      .addCase(uploadProfileImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadProfileImage.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload.profile;
        // store the user data if you want to use it in profile slice
        if (action.payload.user) {
          state.user = action.payload.user;
        }
      })
      .addCase(uploadProfileImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Profile Image
      .addCase(deleteProfileImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProfileImage.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload.profile;
        if (action.payload.user) {
          state.user = action.payload.user;
        }
      })
      .addCase(deleteProfileImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Skills
      .addCase(addSkill.fulfilled, (state, action) => {
        state.profile = action.payload;
      })
      .addCase(removeSkill.fulfilled, (state, action) => {
        state.profile = action.payload;
      })

      // Experience
      .addCase(addExperience.fulfilled, (state, action) => {
        state.profile = action.payload;
      })
      .addCase(updateExperience.fulfilled, (state, action) => {
        state.profile = action.payload;
      })
      .addCase(deleteExperience.fulfilled, (state, action) => {
        state.profile = action.payload;
      })

      // Education
      .addCase(addEducation.fulfilled, (state, action) => {
        state.profile = action.payload;
      })
      .addCase(updateEducation.fulfilled, (state, action) => {
        state.profile = action.payload;
      })
      .addCase(deleteEducation.fulfilled, (state, action) => {
        state.profile = action.payload;
      })

      // Languages
      .addCase(addLanguage.fulfilled, (state, action) => {
        state.profile = action.payload;
      })
      .addCase(removeLanguage.fulfilled, (state, action) => {
        state.profile = action.payload;
      })

      // Resume
      .addCase(uploadResume.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadResume.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        state.uploadProgress = 0;
      })
      .addCase(uploadResume.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.uploadProgress = 0;
      })
      .addCase(deleteResume.fulfilled, (state, action) => {
        state.profile = action.payload;
      });
  },
});

export const { clearProfileError, setUploadProgress, clearUploadProgress } =
  profileSlice.actions;
export default profileSlice.reducer;
