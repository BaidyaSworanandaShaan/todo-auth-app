import React from "react";
import { useAuth } from "../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
const PageHeader = ({ title }) => {
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isDashboard = location.pathname === "/dashboard";
  return (
    <header className="flex justify-between items-center">
      <h1 className="text-2xl font-semibold">{title}</h1>

      <div className="flex gap-4">
        {!isDashboard && (
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-lg font-medium"
          >
            Dashboard
          </button>
        )}
        <button
          onClick={logout}
          className="bg-red-600 text-white px-4 py-2 rounded-lg text-lg font-medium"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default PageHeader;
