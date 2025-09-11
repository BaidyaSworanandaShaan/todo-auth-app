import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

import { getTodos } from "../../services/todoServices";
import PageHeader from "../../components/PageHeader";
import TodoItem from "../../components/TodoItem";

const Dashboard = () => {
  const { user, accessToken, loading } = useAuth();
  const navigate = useNavigate();

  // Filter state
  const [todoFilter, setTodoFilter] = useState("all");

  // Todos and counts
  const [todos, setTodos] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);

  // Error state
  const [error, setError] = useState(null);

  // Fetch todos whenever accessToken or filter changes
  useEffect(() => {
    if (!accessToken) return;

    const fetchTodos = async () => {
      try {
        const { todos, count } = await getTodos(accessToken, todoFilter);
        setTodos(todos);
        setPendingCount(count.pending || 0);
        setCompletedCount(count.completed || 0);
        setError(null);
      } catch (err) {
        setError(
          err.response?.data?.message || err.message || "Something went wrong"
        );
      }
    };

    fetchTodos();
  }, [accessToken, todoFilter]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-lg">Loading...</p>
      </div>
    );
  }

  //Pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6);

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  const currentTodos = todos.slice(startIndex, endIndex);
  return (
    <div className="p-10 md:mx-10">
      <PageHeader title="Dashboard" />
      <span className="font-semibold text-xl block my-5">
        Hello, {user?.email}! 👋
      </span>

      <section className="todos-section">
        {/* Stats */}
        <div className="flex gap-4 mb-6">
          <div
            className={`p-4 rounded-lg cursor-pointer ${
              todoFilter === "all" ? "bg-blue-300" : "bg-blue-100"
            }`}
            onClick={() => setTodoFilter("all")}
          >
            <h2 className="text-lg font-semibold">Total Todos</h2>
            <p className="text-2xl">{pendingCount + completedCount}</p>
          </div>
          <div
            className={`p-4 rounded-lg cursor-pointer ${
              todoFilter === "pending" ? "bg-yellow-300" : "bg-yellow-100"
            }`}
            onClick={() => setTodoFilter("pending")}
          >
            <h2 className="text-lg font-semibold">Pending Todos</h2>
            <p className="text-2xl">{pendingCount}</p>
          </div>
          <div
            className={`p-4 rounded-lg cursor-pointer ${
              todoFilter === "completed" ? "bg-green-300" : "bg-green-100"
            }`}
            onClick={() => setTodoFilter("completed")}
          >
            <h2 className="text-lg font-semibold">Completed Todos</h2>
            <p className="text-2xl">{completedCount}</p>
          </div>
        </div>

        {/* Todo List */}
        {todos.length === 0 ? (
          <p className="text-lg leading-8">Sorry, no todos found</p>
        ) : (
          <div className="mb-5">
            <h2 className="text-xl font-semibold mb-3">
              Your Todos : Showing Results for ' {todoFilter.toUpperCase()} '
            </h2>{" "}
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {currentTodos.map((todo) => (
                <TodoItem key={todo.id} todo={todo} setTodos={setTodos} />
              ))}
            </ul>
          </div>
        )}

        {/* Add Todo Button */}
        <div className="flex justify-between">
          <button
            onClick={() => navigate("/add-todo")}
            className="bg-blue-600 text-white btn hover:bg-blue-700 transition"
          >
            + Add Todo
          </button>
          <div className="flex gap-2 mt-4  items-center">
            {" "}
            <label htmlFor="limit" className="font-medium">
              Todos per page:
            </label>
            <select
              id="limit"
              value={limit}
              onChange={(e) => {
                setLimit(parseInt(e.target.value));
                setPage(1); // reset to first page when limit changes
              }}
              className="border px-2 py-1 rounded"
            >
              <option value={3}>3</option>
              <option value={6}>6</option>
              <option value={9}>9</option>
              <option value={12}>12</option>
            </select>
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              {`<<`}
            </button>
            <span className="px-4 py-2">{page}</span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={endIndex >= todos.length} // no more todos
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              {`>>`}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </section>
    </div>
  );
};

export default Dashboard;
