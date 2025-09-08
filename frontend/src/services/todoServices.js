import axios from "axios";
import api from "../api";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
export const getTodos = async (accessToken) => {
  try {
    const res = await api.get(`${BACKEND_URL}/todos`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      withCredentials: true,
    });

    console.log(res);

    return res.data.todos;
  } catch (err) {
    throw err.response?.data?.message || "Failed to fetch todos";
  }
};
