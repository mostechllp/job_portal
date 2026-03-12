import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/axios";

// Async Thunks
export const fetchJobs = createAsyncThunk(
  "jobs/fetchJobs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("/admin/jobs");
      return response.data.jobs;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch jobs",
      );
    }
  },
);

export const fetchActiveJobs = createAsyncThunk(
  "jobs/fetchActiveJobs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("/admin/jobs/active");
      return response.data.jobs;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch active jobs",
      );
    }
  },
);

export const createJob = createAsyncThunk(
  "jobs/createJob",
  async (jobData, { rejectWithValue }) => {
    try {
      const response = await API.post("/admin/jobs", jobData);
      return response.data; // Should return { job, matches }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create job",
      );
    }
  },
);

export const fetchJobMatches = createAsyncThunk(
  "jobs/fetchMatches",
  async (jobId, { rejectWithValue }) => {
    try {
      const response = await API.get(`/admin/jobs/${jobId}/matches`);
      return { jobId, matches: response.data.matches };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch matches",
      );
    }
  },
);

export const updateJob = createAsyncThunk(
  "jobs/updateJob",
  async ({ id, jobData }, { rejectWithValue }) => {
    try {
      const response = await API.put(`/admin/jobs/${id}`, jobData);
      return response.data.job;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update job",
      );
    }
  },
);

export const deleteJob = createAsyncThunk(
  "jobs/deleteJob",
  async (id, { rejectWithValue }) => {
    try {
      await API.delete(`/admin/jobs/${id}`); // Fixed: added /admin/
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete job",
      );
    }
  },
);

export const toggleJobStatus = createAsyncThunk(
  "jobs/toggleJobStatus",
  async (id, { rejectWithValue }) => {
    try {
      const response = await API.patch(`/admin/jobs/${id}/toggle`);
      return response.data.job;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to toggle job status",
      );
    }
  },
);

const initialState = {
  jobs: [],
  loading: false,
  error: null,
  lastPostedJob: null, // Added missing state
  jobMatches: {}, // Added missing state
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
  toggleLoading: false,
};

const jobSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    clearJobError: (state) => {
      state.error = null;
    },
    clearLastPostedJob: (state) => {
      state.lastPostedJob = null;
    },
    clearJobMatches: (state) => {
      state.jobMatches = {};
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Jobs
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Active Jobs
      .addCase(fetchActiveJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActiveJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload;
      })
      .addCase(fetchActiveJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Job
      .addCase(createJob.pending, (state) => {
        state.createLoading = true;
        state.error = null;
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.createLoading = false;
        state.jobs.unshift(action.payload.job);
        state.lastPostedJob = {
          job: action.payload.job,
          matches: action.payload.matches || [],
        };
      })
      .addCase(createJob.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload;
      })

      // Update Job
      .addCase(updateJob.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(updateJob.fulfilled, (state, action) => {
        state.updateLoading = false;
        const index = state.jobs.findIndex(
          (job) => job._id === action.payload._id,
        );
        if (index !== -1) {
          state.jobs[index] = action.payload;
        }
      })
      .addCase(updateJob.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload;
      })

      // Fetch Job Matches
      .addCase(fetchJobMatches.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobMatches.fulfilled, (state, action) => {
        state.loading = false;
        state.jobMatches = {
          ...state.jobMatches,
          [action.payload.jobId]: action.payload.matches,
        };
      })
      .addCase(fetchJobMatches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Job
      .addCase(deleteJob.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.jobs = state.jobs.filter((job) => job._id !== action.payload);
      })
      .addCase(deleteJob.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload;
      })

      // Toggle Job Status
      .addCase(toggleJobStatus.pending, (state) => {
        state.toggleLoading = true;
        state.error = null;
      })
      .addCase(toggleJobStatus.fulfilled, (state, action) => {
        state.toggleLoading = false;
        const index = state.jobs.findIndex(
          (job) => job._id === action.payload._id,
        );
        if (index !== -1) {
          state.jobs[index] = action.payload;
        }
      })
      .addCase(toggleJobStatus.rejected, (state, action) => {
        state.toggleLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearJobError, clearLastPostedJob, clearJobMatches } =
  jobSlice.actions;
export default jobSlice.reducer;
