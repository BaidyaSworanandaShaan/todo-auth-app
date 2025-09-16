import axios from "axios";
import api from "../api";
import { useAuth } from "../context/AuthContext";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const getDashboardStats = async (accessToken, userId) => {
  try {
    const res = await api.get(`${BACKEND_URL}/users/${userId}/dashboard`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      withCredentials: true,
    });

    console.log("Response", res);
    return res.data;
  } catch (err) {
    throw err.response?.data?.message || "Failed to fetch todos";
  }
};
