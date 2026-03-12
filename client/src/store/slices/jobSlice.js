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
        error.response?.data?.message || "Failed to fetch jobs"
      );
    }
  }
);

export const fetchActiveJobs = createAsyncThunk(
  "jobs/fetchActiveJobs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("/admin/jobs/active");
      return response.data.jobs;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch active jobs"
      );
    }
  }
);

export const createJob = createAsyncThunk(
  "jobs/createJob",
  async (jobData, { rejectWithValue }) => {
    try {
      const response = await API.post("/admin/jobs", jobData);
      return response.data.job;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create job"
      );
    }
  }
);

export const updateJob = createAsyncThunk(
  "jobs/updateJob",
  async ({ id, jobData }, { rejectWithValue }) => {
    try {
      const response = await API.put(`/admin/jobs/${id}`, jobData);
      return response.data.job;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update job"
      );
    }
  }
);

export const deleteJob = createAsyncThunk(
  "jobs/deleteJob",
  async (id, { rejectWithValue }) => {
    try {
      await API.delete(`/jobs/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete job"
      );
    }
  }
);

export const toggleJobStatus = createAsyncThunk(
  "jobs/toggleJobStatus",
  async (id, { rejectWithValue }) => {
    try {
      const response = await API.patch(`/admin/jobs/${id}/toggle`);
      return response.data.job;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to toggle job status"
      );
    }
  }
);

const initialState = {
  jobs: [],
  loading: false,
  error: null,
};

const jobSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    clearJobError: (state) => {
      state.error = null;
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
      
      // Create Job
      .addCase(createJob.fulfilled, (state, action) => {
        state.jobs.unshift(action.payload);
      })
      
      // Update Job
      .addCase(updateJob.fulfilled, (state, action) => {
        const index = state.jobs.findIndex(job => job._id === action.payload._id);
        if (index !== -1) {
          state.jobs[index] = action.payload;
        }
      })
      
      // Delete Job
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.jobs = state.jobs.filter(job => job._id !== action.payload);
      })
      
      // Toggle Job Status
      .addCase(toggleJobStatus.fulfilled, (state, action) => {
        const index = state.jobs.findIndex(job => job._id === action.payload._id);
        if (index !== -1) {
          state.jobs[index] = action.payload;
        }
      });
  },
});

export const { clearJobError } = jobSlice.actions;
export default jobSlice.reducer;