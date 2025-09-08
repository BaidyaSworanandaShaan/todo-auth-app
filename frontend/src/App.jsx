import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home/Home";
import Register from "./pages/Registration/Register";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/dashboard";
import ProtectedRoute from "../components/ProtectedRoutes";
import { AuthProvider } from "../context/AuthContext";
import AddTodos from "./pages/Todos/AddTodos";

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
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/add-todo",
    element: (
      <ProtectedRoute>
        <AddTodos />
      </ProtectedRoute>
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
