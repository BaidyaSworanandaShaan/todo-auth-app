import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Home from "./pages/Home/Home";
import Register from "./pages/Registration/Register";
import Login from "./pages/Login/Login";

import ProtectedRoute from "./components/ProtectedRoutes";
import { AuthProvider } from "./context/AuthContext";
import AddTodos from "./pages/Todos/AddTodos";
import SingleTodo from "./pages/SingleTodo/SingleTodo";
import Dashboard from "./pages/Dashboard/dashboard";

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
  {
    path: "/todos/:id",
    element: (
      <ProtectedRoute>
        <SingleTodo />
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
