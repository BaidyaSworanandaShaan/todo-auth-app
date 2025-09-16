import axios from "axios";
import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import PageHeader from "../PageHeader";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const TodoItem = ({ todo, setTodos }) => {
  const { accessToken } = useAuth();

  const navigate = useNavigate();
  const handleTodoDelete = async (todoId, setTodos, accessToken) => {
    try {
      const response = await axios.delete(`${BACKEND_URL}/todos/${todoId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      });

      setTodos((prevTodos) => prevTodos?.filter((todo) => todo.id !== todoId));

      alert(response.data.message);
      navigate("/dashboard");
    } catch (err) {
      console.error("Failed to delete todo:", err);

      // Only show backend message if available
      alert(err.response?.data?.message || "Something went wrong");
    }
  };
  return (
    <div
      className={`border rounded-lg p-5 shadow-sm transition-shadow duration-200 
    ${
      todo.status_id === 1
        ? "bg-green-50 border-green-300"
        : todo.status_id === 2
        ? "bg-yellow-50 border-yellow-300"
        : todo.status_id === 3
        ? "bg-gray-100 border-gray-300"
        : "bg-white border-gray-200"
    } hover:shadow-md`}
    >
      {/* Title and Status */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-xl font-semibold">{todo.title}</h3>
        <p
          className={`font-bold text-xl ${
            todo.priority >= 3 ? "bg-green-500" : "bg-red-500"
          }  text-white w-10 h-10 flex items-center justify-center rounded-full`}
        >
          {todo.priority}
        </p>
      </div>

      {/* Dates */}
      <p className="mb-1">
        Created at: {new Date(todo.created_at).toLocaleDateString()}
      </p>
      <p className="mb-1">
        Due at: {new Date(todo.due_at).toLocaleDateString()}
      </p>
      {todo.completed_at && (
        <p className="mb-3">
          Completed At: {new Date(todo.completed_at).toLocaleDateString()}
        </p>
      )}

      {/* Priority & Estimate */}
      <div className="flex justify-between items-center mb-3">
        <p>Estimate Hours: {todo.estimate_hours}</p>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {JSON.parse(todo.tags).map((tag, index) => (
          <span
            key={index}
            className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full"
          >
            {tag.toUpperCase()}
          </span>
        ))}
      </div>

      {/* Delete Button */}
      <button
        onClick={() => {
          if (window.confirm("Are you sure you want to delete this todo?")) {
            handleTodoDelete(todo.id);
          }
        }}
        className="btn-small btn-danger mt-5"
      >
        Delete Todo
      </button>
    </div>
  );
};

export default TodoItem;
