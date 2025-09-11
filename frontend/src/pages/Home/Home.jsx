import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Welcome to Todo</h1>

      <div className="flex gap-4">
        <button onClick={() => navigate("/login")} className="btn btn-primary">
          Login
        </button>

        <button
          onClick={() => navigate("/register")}
          className="btn  btn-secondary"
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default Home;
