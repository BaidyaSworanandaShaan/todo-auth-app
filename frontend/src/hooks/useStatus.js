import { useState, useEffect } from "react";

import { useAuth } from "../context/AuthContext";
import { getStatus } from "../services/statusServices";

export const useStatus = () => {
  const { accessToken } = useAuth();
  const [status, setStatus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!accessToken) return;

    const fetchStatus = async () => {
      try {
        setLoading(true);
        const { status } = await getStatus(accessToken);
        setStatus(status);
        setError(null);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, [accessToken]); // re-fetch if filters change

  return { status, loading, error };
};
