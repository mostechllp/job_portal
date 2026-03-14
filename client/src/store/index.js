import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer, { rehydrate } from "./slices/authSlice";
import profileReducer from "./slices/profileSlice";
import jobReducer from "./slices/jobSlice";
import seekerJobReducer from "./slices/seekerJobSlice";

// Persist config for auth reducer
const persistConfig = {
  key: "auth",
  storage,
  whitelist: ["user", "token"], // only these fields will be persisted
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    profile: profileReducer,
    jobs: jobReducer,
    seekerJobs: seekerJobReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

// Listen for rehydration and dispatch our action
const persistor = persistStore(store, null, () => {
  // This callback runs after rehydration is complete
  const state = store.getState();
  store.dispatch(rehydrate(state.auth));
});

export { persistor };
