import api from "../api";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
export const getAllProjectsOfUser = async (accessToken) => {
  try {
    const res = await api.get(`${BACKEND_URL}/projects`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      withCredentials: true,
    });

    console.log("Response", res);
    return res.data;
  } catch (err) {
    throw err.response?.data?.message || "Failed to fetch todos";
  }
};
export const getProjectDetail = async (accessToken, projectId) => {
  try {
    const [todosRes, statsRes] = await Promise.all([
      api.get(`${BACKEND_URL}/projects/${projectId}/todos`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        withCredentials: true,
      }),
      api.get(`${BACKEND_URL}/projects/${projectId}/stats`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        withCredentials: true,
      }),
    ]);

    // Return consistent object
    return {
      project: todosRes.data.project,
      todos: todosRes.data.todos,
      stats: statsRes.data.projectStats,
    };
  } catch (err) {
    throw err.response?.data?.message || "Failed to fetch project details";
  }
};
