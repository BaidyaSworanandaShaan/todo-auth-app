import React from "react";
import { useAuth } from "../context/AuthContext";

const PageHeader = ({ title }) => {
  const { logout } = useAuth();
  return (
    <header className="flex justify-between items-center mb-8">
      <h1 className="text-2xl font-semibold">{title}</h1>

      <button
        onClick={logout}
        className="bg-red-500  px-4 py-2 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </header>
  );
};

export default PageHeader;
