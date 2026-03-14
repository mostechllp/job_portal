/* eslint-disable no-unused-vars */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/axios";

export const fetchJobs = createAsyncThunk(
  "seekerJobs/fetchJobs",
  async (params = {}, { rejectWithValue }) => {
    try {
      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([_, v]) => v != null && v !== '')
      );
      
      const queryParams = new URLSearchParams(cleanParams).toString();
      const response = await API.get(`/jobs?${queryParams}`);
      console.log("Job response: ", response.data)
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch jobs"
      );
    }
  }
);

export const searchJobs = createAsyncThunk(
  "seekerJobs/searchJobs",
  async (searchParams, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams(searchParams).toString();
      const response = await API.get(`/jobs/search?${queryParams}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to search jobs"
      );
    }
  }
);

export const fetchJobDetails = createAsyncThunk(
  "seekerJobs/fetchJobDetails",
  async (jobId, { rejectWithValue }) => {
    try {
      const response = await API.get(`/jobs/${jobId}`);
      return response.data.job;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch job details"
      );
    }
  }
);

export const fetchSimilarJobs = createAsyncThunk(
  "seekerJobs/fetchSimilarJobs",
  async ({ jobId, limit = 5 }, { rejectWithValue }) => {
    try {
      const response = await API.get(`/jobs/${jobId}/similar?limit=${limit}`);
      return response.data.jobs;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch similar jobs"
      );
    }
  }
);

export const applyForJob = createAsyncThunk(
  "seekerJobs/applyForJob",
  async ({ jobId, applicationData }, { rejectWithValue }) => {
    try {
      const response = await API.post(`/applications`, {
        jobId,
        ...applicationData
      });
      return response.data.application;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to apply for job"
      );
    }
  }
);

export const fetchAppliedJobs = createAsyncThunk(
  "seekerJobs/fetchAppliedJobs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get(`/applications/my-applications`);
      return response.data.applications;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch applied jobs"
      );
    }
  }
);

const initialState = {
  jobs: [],
  featuredJobs: [],
  similarJobs: [],
  currentJob: null,
  appliedJobs: [],
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  },
  loading: false,
  error: null,
  searchLoading: false,
  applyLoading: false
};

const seekerJobSlice = createSlice({
  name: "seekerJobs",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentJob: (state) => {
      state.currentJob = null;
    },
    clearSimilarJobs: (state) => {
      state.similarJobs = [];
    },
    resetPagination: (state) => {
      state.pagination = initialState.pagination;
    }
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
        state.jobs = action.payload.jobs;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Search Jobs
      .addCase(searchJobs.pending, (state) => {
        state.searchLoading = true;
        state.error = null;
      })
      .addCase(searchJobs.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.jobs = action.payload.jobs;
      })
      .addCase(searchJobs.rejected, (state, action) => {
        state.searchLoading = false;
        state.error = action.payload;
      })

      // Fetch Job Details
      .addCase(fetchJobDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentJob = action.payload;
      })
      .addCase(fetchJobDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Similar Jobs
      .addCase(fetchSimilarJobs.fulfilled, (state, action) => {
        state.similarJobs = action.payload;
      })

      // Apply for Job
      .addCase(applyForJob.pending, (state) => {
        state.applyLoading = true;
        state.error = null;
      })
      .addCase(applyForJob.fulfilled, (state, action) => {
        state.applyLoading = false;
        state.appliedJobs.push(action.payload);
      })
      .addCase(applyForJob.rejected, (state, action) => {
        state.applyLoading = false;
        state.error = action.payload;
      })

      // Fetch Applied Jobs
      .addCase(fetchAppliedJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppliedJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.appliedJobs = action.payload;
      })
      .addCase(fetchAppliedJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { 
  clearError, 
  clearCurrentJob, 
  clearSimilarJobs, 
  resetPagination 
} = seekerJobSlice.actions;

export default seekerJobSlice.reducer;