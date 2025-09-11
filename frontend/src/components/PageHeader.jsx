import React from "react";
import { useAuth } from "../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
const PageHeader = ({ title }) => {
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isDashboard = location.pathname === "/dashboard";
  return (
    <header className="flex justify-between items-center ">
      <h1 className="text-2xl font-semibold">{title}</h1>

      <div className="flex gap-4">
        {!isDashboard && (
          <button
            className=" btn  bg-blue-600 text-white "
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </button>
        )}
        <button className="btn bg-red-600 text-white  " onClick={logout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default PageHeader;
