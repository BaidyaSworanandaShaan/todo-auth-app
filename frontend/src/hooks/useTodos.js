import { useState, useEffect } from "react";

import { getTodos } from "../services/todoServices";
import { useAuth } from "../context/AuthContext";

export const useTodos = () => {
  const { accessToken } = useAuth();
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!accessToken) return;

    const fetchTodos = async () => {
      try {
        setLoading(true);
        const { todos } = await getTodos(accessToken);
        setTodos(todos);
        setError(null);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, [accessToken]); // re-fetch if filters change

  return { todos, setTodos, loading, error };
};
