// main.jsx or wherever your router is defined
import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { App } from "./App";
import { store } from "./store";
import { Provider, useDispatch, useSelector } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AdminLoginPage } from "./pages/AdminLoginPage";
import { AdminRoute } from "./components/AdminRoute";
import { AdminDashboardPage } from "./pages/AdminDashboardPage";
import { loadUser } from "./store/slices/authSlice";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/admin/login",
    element: <AdminLoginPage />,
  },
  {
    path: "/admin/dashboard",
    element: (
      <AdminRoute>
        <AdminDashboardPage />
      </AdminRoute>
    ),
  },
]);

// Create a root component that waits for initialization
// eslint-disable-next-line react-refresh/only-export-components
function Root() {
  const { isInitialized, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (token && !isInitialized) {
      dispatch(loadUser());
    }
  }, [dispatch, token, isInitialized]);

  // Show loading while initializing
  if (token && !isInitialized) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading application...</p>
        </div>
      </div>
    );
  }

  return <RouterProvider router={router} />;
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <Root />
    </Provider>
  </StrictMode>,
);