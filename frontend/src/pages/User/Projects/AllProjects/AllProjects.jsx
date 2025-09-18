import React, { useState } from "react";
import { useAuth } from "../../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useProjects } from "../../../../hooks/useProjects";
import PageHeader from "../../../../components/PageHeader";
import ProjectItem from "../../../../components/User/ProjectItem";

const AllProjects = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
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

  console.log("Projects", projects);

  const filteredProjects = projects.filter((project) =>
    project.project_name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <div className="p-10 md:mx-10">
      <PageHeader title="All Projects" />
      <div className="my-4">
        <input
          type="text"
          placeholder="Search projects by name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 mt-5 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
        />
      </div>
      <section className="project-section">
        <div className="mt-10">
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredProjects.length > 0
              ? filteredProjects.map((project) => (
                  <ProjectItem
                    key={project.project_id}
                    project={project}
                    setProjects={setProjects}
                  />
                ))
              : "Sorry, No Projects Found"}
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
