import React, { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";

import { getTodos } from "../../services/todoServices";
import PageHeader from "../../../components/PageHeader";

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
            <ul className="space-y-2">
              {todos.map((todo) => (
                <li
                  key={todo.id}
                  className={`p-3 rounded border ${
                    todo.status === "completed"
                      ? "bg-green-50 border-green-300"
                      : "bg-yellow-50 border-yellow-300"
                  }`}
                >
                  <h3 className="font-semibold">{todo.title}</h3>
                  <p>{todo.description}</p>
                  <p className="text-sm text-gray-500">Status: {todo.status}</p>
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
