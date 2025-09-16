import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Home from "./pages/Home/Home";
import Register from "./pages/Registration/Register";
import Login from "./pages/Login/Login";

import ProtectedRoute from "./components/User/ProtectedRoutes";
import { AuthProvider } from "./context/AuthContext";

import SingleTodo from "./pages/User/Todos/SingleTodo/SingleTodo";
import Dashboard from "./pages/User/Dashboard/dashboard";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import ProtectedAdminRoute from "./components/Admin/ProtectedAdminRoutes";
import Unauthorized from "./pages/Unauthorized/Unauthorized";
import AddTodo from "./pages/User/Todos/AddTodos/AddTodos";
import AddProjects from "./pages/User/Projects/AddProjects/AddProjects";
import ProjectDetail from "./pages/User/Projects/ProjectDetail/ProjectDetail";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/unauthorized",
    element: <Unauthorized />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/todos/add",
    element: (
      <ProtectedRoute>
        <AddTodo />
      </ProtectedRoute>
    ),
  },
  {
    path: "/todos/:id",
    element: (
      <ProtectedRoute>
        <SingleTodo />
      </ProtectedRoute>
    ),
  },
  {
    path: "/projects/add",
    element: (
      <ProtectedRoute>
        <AddProjects />
      </ProtectedRoute>
    ),
  },
  {
    path: "/projects/:id",
    element: (
      <ProtectedRoute>
        <ProjectDetail />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin-dashboard",
    element: (
      <ProtectedAdminRoute>
        <AdminDashboard />
      </ProtectedAdminRoute>
    ),
  },
]);
function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
