import axios from "axios";
import React from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import PageHeader from "./PageHeader";
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
    <>
      <li
        key={todo.id}
        className={` mt-5 p-4 rounded border flex flex-col justify-between  ${
          todo.status === "completed"
            ? "bg-green-50 border-green-300"
            : "bg-yellow-50 border-yellow-300"
        }`}
      >
        <div>
          <h3 className="font-semibold text-lg">
            <Link to={`/todos/${todo.id}`} className="underline">
              {todo.title}
            </Link>
          </h3>
          <p className="text-gray-700">{todo.description}</p>
          <p className="text-sm text-gray-500 mt-1">
            Status: {todo.status.toUpperCase()}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Due Date: {todo.due_date.split("T")[0]}
          </p>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            const confirmDelete = window.confirm(
              "Are you sure you want to delete this todo?"
            );
            if (confirmDelete) {
              handleTodoDelete(todo.id, setTodos, accessToken);
            }
          }}
          className="mt-3 btn btn-danger"
        >
          Delete
        </button>
      </li>
    </>
  );
};

export default TodoItem;
