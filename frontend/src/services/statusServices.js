import axios from "axios";
import api from "../api";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
export const getStatus = async (accessToken) => {
  try {
    const res = await api.get(`${BACKEND_URL}/status`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      withCredentials: true,
    });

    console.log("Response", res);
    return res.data;
  } catch (err) {
    throw err.response?.data?.message || "Failed to fetch todos";
  }
};
