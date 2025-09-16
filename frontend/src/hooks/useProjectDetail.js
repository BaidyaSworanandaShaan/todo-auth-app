import { useState, useEffect } from "react";
import { getProjectDetail } from "../services/projectServices";
import { useAuth } from "../context/AuthContext";

export const useProjectDetail = ({ projectId }) => {
  const { accessToken } = useAuth();
  const [project, setProject] = useState(null);
  const [todos, setTodos] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!accessToken) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const {
          project: proj,
          todos: todoRows,
          stats: projStats,
        } = await getProjectDetail(accessToken, projectId);

        setProject(proj);
        setTodos(todoRows);
        setStats(projStats);
        setError(null);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [accessToken, projectId]);

  return { project, todos, setTodos, stats, loading, error };
};
