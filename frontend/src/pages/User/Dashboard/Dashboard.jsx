import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import PageHeader from "../../../components/PageHeader";
import TodoItem from "../../../components/User/TodoItem";
import ProjectItem from "../../../components/User/ProjectItem";
import { useProjects } from "../../../hooks/useProjects";
import { useTodos } from "../../../hooks/useTodos";
import DashboardStats from "../../../components/User/DashboardStats";

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const { projects, setProjects, loading: projectsLoading } = useProjects();

  const {
    todos,
    setTodos,
    loading: todosLoading,
  } = useTodos({ assigneeId: user?.id });

  if (loading || projectsLoading || todosLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-10 md:mx-10">
      <PageHeader title="Dashboard" />
      <span className="font-semibold text-xl block my-5">
        Hello, {user?.email}! 👋
      </span>
      <DashboardStats />
      {/* Projects Section */}
      <section className="project-section">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold my-4">Recent Projects</h2>
          <button className="mt-3 btn" onClick={() => navigate("/projects")}>
            View All
          </button>
        </div>

        <div className="mb-5">
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
          className="mt-3 btn btn-secondary"
          onClick={() => navigate("/projects/add")}
        >
          + Add New Projects
        </button>
      </section>

      {/* Todos Section */}
      <section className="todo-section mt-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold my-4">List of Recent Todos</h2>
        </div>
        <div className="mb-5">
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {todos.slice(0, 8).map((todo) => (
              <TodoItem key={todo.id} todo={todo} setTodos={setTodos} />
            ))}
          </ul>
        </div>{" "}
      </section>
    </div>
  );
};

export default Dashboard;
