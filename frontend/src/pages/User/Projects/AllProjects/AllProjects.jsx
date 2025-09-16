import React from "react";
import { useAuth } from "../../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useProjects } from "../../../../hooks/useProjects";
import PageHeader from "../../../../components/PageHeader";
import ProjectItem from "../../../../components/User/ProjectItem";

const AllProjects = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const {
    projects,
    setProjects,
    loading: projectsLoading,
    error: projectsError,
  } = useProjects();
  if (loading || projectsLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-lg">Loading...</p>
      </div>
    );
  }
  return (
    <div className="p-10 md:mx-10">
      <PageHeader title="All Projects" />
      <section className="project-section">
        <div className="mt-10">
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {projects.slice(0, 8).map((project) => (
              <ProjectItem
                key={project.project_id}
                project={project}
                setProjects={setProjects}
              />
            ))}
          </ul>
        </div>
        <button
          className="mt-5 btn btn-secondary"
          onClick={() => navigate("/projects/add")}
        >
          + Add New Projects
        </button>
      </section>
    </div>
  );
};

export default AllProjects;
