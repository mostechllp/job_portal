import { createBrowserRouter } from "react-router-dom";

import { App } from "../App";
import { AdminDashboardPage } from "../pages/AdminDashboardPage";
import {AdminRoute} from "../components/admin/AdminRoute"
import AdminLoginPage from "../pages/AdminLoginPage";
import { JobsPage } from "../pages/JobsPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/jobs",
    element: <JobsPage />,
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

export default router;