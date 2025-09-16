import axios from "axios";
import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const ProjectItem = ({ project, setProjects }) => {
  const { accessToken } = useAuth();

  const navigate = useNavigate();
  const handleProjectDelete = async (todoId, setProject, accessToken) => {
    try {
      const response = await axios.delete(`${BACKEND_URL}/todos/${todoId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      });

      setTodos((prevTodos) => prevTodos?.filter((todo) => todo.id !== todoId));

      alert(response.data.message);
      navigate("/dashboard");
    } catch (err) {
      console.error("Failed to delete todo:", err);

      // Only show backend message if available
      alert(err.response?.data?.message || "Something went wrong");
    }
  };
  return (
    <>
      <li
        key={project.project_id}
        className="p-4 rounded border flex flex-col justify-between"
      >
        <div>
          <h3 className="font-semibold text-lg">{project.project_name}</h3>
          <p className="mb-1">Project ID: {project.project_id}</p>
          <p className="mb-1">
            Created At:{" "}
            {new Date(project.project_created_at).toLocaleDateString()}
          </p>
          <p className="mb-1">
            Due Date: {new Date(project.project_due_date).toLocaleDateString()}
          </p>
        </div>

        <button
          onClick={() => navigate(`/projects/${project.project_id}`)} // navigate to project details
          className="mt-3 btn btn-primary"
        >
          View Details
        </button>
      </li>
    </>
  );
};

export default ProjectItem;
