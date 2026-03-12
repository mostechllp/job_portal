import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice"
import profileReducer from "./slices/profileSlice"
import jobReducer from "./slices/jobSlice"
import seekerJobReducer from "./slices/seekerJobSlice"

export const store = configureStore({
    reducer: {
        auth: authReducer,
        profile: profileReducer,
        jobs: jobReducer,
        seekerJobs: seekerJobReducer,
    }
})