import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Refresh token on app start
  useEffect(() => {
    const refreshAccessToken = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/auth/refresh-token`, {
          withCredentials: true,
        });
        console.log(res);
        setAccessToken(res.data.accessToken);
        setUser(res.data.user);
      } catch (err) {
        setAccessToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    refreshAccessToken();
  }, []);

  // Call this after login
  const login = (token, userData) => {
    setAccessToken(token);

    console.log(token, userData);
    setUser(userData);
  };

  const logout = async () => {
    try {
      await axios.post(
        `${BACKEND_URL}/auth/logout`,
        {},
        { withCredentials: true }
      );
      setAccessToken(null);
      setUser(null);
      document.cookie = "refreshToken=; Max-Age=0; path=/;";
      window.location.href = "/login"; // redirect to login
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ accessToken, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
