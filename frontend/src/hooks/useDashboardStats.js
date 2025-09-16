import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getDashboardStats } from "../services/dashboardServices";

export const useDashboardStats = () => {
  const { accessToken, user } = useAuth();
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!accessToken || !user) return;

    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        const { data } = await getDashboardStats(accessToken, user.id);
        setDashboardStats(data);
        setError(null);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, [accessToken, user]);

  return { dashboardStats, setDashboardStats, loading, error };
};
