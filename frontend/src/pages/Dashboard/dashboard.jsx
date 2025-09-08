import React, { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";

import { getTodos } from "../../services/todoServices";
import PageHeader from "../../../components/PageHeader";
import axios from "axios";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const Dashboard = () => {
  const { user, accessToken, loading } = useAuth();
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!accessToken) return; // fetch only if accessToken exists

    const fetchTodos = async () => {
      try {
        const data = await getTodos(accessToken);
        setTodos(data);
      } catch (err) {
        setError(err);
      }
    };

    fetchTodos();
  }, [accessToken]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-lg">Loading...</p>
      </div>
    );
  }

  const pendingCount = todos.filter((todo) => todo.status === "pending").length;
  const completedCount = todos.filter(
    (todo) => todo.status === "completed"
  ).length;

  const handleTodoDelete = async (todoId, setTodos, accessToken) => {
    try {
      const response = await axios.delete(`${BACKEND_URL}/todos/${todoId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      });

      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== todoId));

      alert(response.data.message);
    } catch (err) {
      console.error("Failed to delete todo:", err);

      // Only show backend message if available
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="p-10 mx-4 md:mx-10">
      <PageHeader title={"Dashboard"} />
      <span className="font-semibold text-xl block my-10">
        Hello, {user?.email}! 👋
      </span>
      {todos.length === 0 ? (
        <section className="welcome-message mb-6">
          <p className="text-lg leading-8">
            <br />
            We’re thrilled to have you here. It looks like this is your first
            visit. Start by adding your very first task, and watch how small
            steps turn into big achievements. Your journey to staying organized
            starts now. Let’s get things rolling and make every day a productive
            one! 🚀
          </p>

          <div className="mt-5">
            <button
              onClick={() => navigate("/add-todo")}
              className="bg-green-600 text-white px-4 py-2 rounded-lg text-lg font-medium hover:bg-blue-600 transition"
            >
              + Add Your First Todo
            </button>
          </div>
        </section>
      ) : (
        <section className="todos-section">
          {/* Todo Stats */}
          <div className="flex gap-4 mb-6">
            <div className="p-4 bg-yellow-100 rounded-lg">
              <h2 className="text-lg font-semibold">Pending Todos</h2>
              <p className="text-2xl">{pendingCount}</p>
            </div>
            <div className="p-4 bg-green-100 rounded-lg">
              <h2 className="text-lg font-semibold">Completed Todos</h2>
              <p className="text-2xl">{completedCount}</p>
            </div>
          </div>

          {/* Todo List */}
          <div className="mb-5">
            <h2 className="text-xl font-semibold mb-3">Your Todos</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {todos.map((todo) => (
                <li
                  key={todo.id}
                  className={`p-4 rounded border flex flex-col justify-between ${
                    todo.status === "completed"
                      ? "bg-green-50 border-green-300"
                      : "bg-yellow-50 border-yellow-300"
                  }`}
                >
                  <div>
                    <h3 className="font-semibold text-lg">{todo.title}</h3>
                    <p className="text-gray-700">{todo.description}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Status: {todo.status}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      const confirmDelete = window.confirm(
                        "Are you sure you want to delete this todo?"
                      );
                      if (confirmDelete) {
                        handleTodoDelete(todo.id, setTodos, accessToken);
                      }
                    }}
                    className="mt-3 bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded shadow-md transition"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Add Todo Button */}
          <button
            onClick={() => navigate("/add-todo")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-lg font-medium hover:bg-blue-700 transition"
          >
            + Add Todo
          </button>
        </section>
      )}

      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default Dashboard;
