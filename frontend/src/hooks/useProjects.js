import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getAllProjectsOfUser } from "../services/projectServices";

export const useProjects = () => {
  const { accessToken } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!accessToken) return;

    const fetchProjects = async () => {
      try {
        setLoading(true);
        const { projects } = await getAllProjectsOfUser(accessToken);

        setProjects(projects);
        setError(null);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [accessToken]);

  return { projects, setProjects, loading, error };
};
