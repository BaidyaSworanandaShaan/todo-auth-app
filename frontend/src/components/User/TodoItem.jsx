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
    <div className="border rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Title and Status */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-xl font-semibold">{todo.title}</h3>
      </div>

      {/* Project and Assignee */}
      {/* <p className="text-gray-600 dark:text-gray-300 mb-1">
        <strong>Project ID:</strong> {todo.project_id}
      </p>
      <p className="text-gray-600 dark:text-gray-300 mb-1">
        <strong>Assignee ID:</strong> {todo.assignee_id}
      </p>
      <p className="text-gray-600 dark:text-gray-300 mb-3">
        <strong>Status ID:</strong> {todo.status_id}
      </p> */}

      {/* Dates */}
      <p className=" mb-1">
        Created at: {new Date(todo.created_at).toLocaleDateString()}
      </p>
      <p className=" mb-1">
        Due at: {new Date(todo.due_at).toLocaleDateString()}
      </p>
      {todo.completed_at && (
        <p className=" mb-3">
          Completed At: {new Date(todo.completed_at).toLocaleDateString()}
        </p>
      )}

      {/* Priority & Estimate */}
      <p className=" mb-3">
        Priority: {todo.priority} | Estimate Hours: {todo.estimate_hours}
      </p>

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
    </div>
  );
};

export default TodoItem;
