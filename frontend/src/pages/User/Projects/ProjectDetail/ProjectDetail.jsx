import PageHeader from "../../../../components/PageHeader";
import { useProjectDetail } from "../../../../hooks/useProjectDetail";
import { useNavigate, useParams } from "react-router-dom";
import TodoItem from "../../../../components/User/TodoItem";
import ProjectStats from "../../../../components/User/ProjectStats";
import { useState } from "react";
import api from "../../../../api";
import { useAuth } from "../../../../context/AuthContext";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const ProjectDetail = () => {
  const { id: projectId } = useParams();
  const { accessToken } = useAuth();
  const navigate = useNavigate();
  const { project, todos, stats, setTodos, loading, error } = useProjectDetail({
    projectId,
  });

  // Local filter state
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sortByDue, setSortByDue] = useState("none");

  if (loading) return <p className="p-10">Loading...</p>;
  if (error) return <p className="p-10">Error loading project</p>;
  if (!project) return <p className="p-10">Project not found</p>;

  // Apply filters
  let filteredTodos = [...todos];

  if (statusFilter !== "all") {
    filteredTodos = filteredTodos.filter(
      (t) => t.status_id === Number(statusFilter)
    );
  }

  if (priorityFilter !== "all") {
    filteredTodos = filteredTodos.filter(
      (t) => t.priority === Number(priorityFilter)
    );
  }

  if (sortByDue !== "none") {
    filteredTodos.sort((a, b) => {
      const dateA = new Date(a.due_at || 0);
      const dateB = new Date(b.due_at || 0);
      return sortByDue === "asc" ? dateA - dateB : dateB - dateA;
    });
  }
  const handleProjectDelete = async (projectId, accessToken) => {
    try {
      const response = await api.delete(
        `${BACKEND_URL}/projects/${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );

      alert(response.data.message);
      navigate("/dashboard");
    } catch (err) {
      console.error("Failed to delete project:", err);

      // Only show backend message if available
      alert(err.response?.data?.message || "Something went wrong");
    }
  };
  return (
    <div className="p-10 md:mx-10 space-y-6">
      <PageHeader title="Project Detail" />
      {/* Project Card */}
      <div className="p-6 border">
        <h2 className="text-xl font-semibold mb-2">{project.project_name}</h2>
        <p className="text-gray-600">Project ID : {project.project_id}</p>
        <p className="text-gray-600">
          Due Date: {new Date(project.project_due_date).toLocaleDateString()}
        </p>
        <p className="text-gray-600">
          Created At:{" "}
          {new Date(project.project_created_at).toLocaleDateString()}
        </p>
        <button
          className="btn-small btn-danger mt-3"
          onClick={() => {
            if (
              window.confirm("Are you sure you want to delete this project?")
            ) {
              handleProjectDelete(project.project_id, accessToken);
            }
          }}
        >
          Delete
        </button>
      </div>

      {/* Project Stats & Filters */}
      <div className="grid grid-cols-12 gap-4">
        {/* Sidebar Filters */}
        <div className="col-span-3 p-4 border rounded-lg bg-white shadow-sm">
          <h3 className="font-semibold mb-3">Filters</h3>

          {/* Status Filter */}
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full border rounded-md p-2 mb-3"
          >
            <option value="all">All</option>
            <option value="1">Open</option>
            <option value="2">In Progress</option>
            <option value="3">Closed</option>
          </select>

          {/* Priority Filter */}
          <label className="block text-sm font-medium mb-1">Priority</label>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full border rounded-md p-2 mb-3"
          >
            <option value="all">All</option>
            <option value="1">Very High</option>
            <option value="2"> High</option>
            <option value="3">Medium</option>
            <option value="4">Low</option>
            <option value="5">Very Low</option>
          </select>

          {/* Sort by Due Date */}
          <label className="block text-sm font-medium mb-1">Sort by Due</label>
          <select
            value={sortByDue}
            onChange={(e) => setSortByDue(e.target.value)}
            className="w-full border rounded-md p-2"
          >
            <option value="none">None</option>
            <option value="asc">Earliest First</option>
            <option value="desc">Latest First</option>
          </select>
        </div>

        {/* Main Content */}
        <div className="col-span-9 p-4">
          <ProjectStats stats={stats} />

          {/* Todos */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Todos</h3>
            {filteredTodos?.length === 0 ? (
              <p className="text-gray-500">No todos match filters</p>
            ) : (
              <div className="mb-5">
                <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {filteredTodos.map((todo) => (
                    <TodoItem
                      key={todo.id}
                      todo={todo}
                      setTodos={setTodos}
                      projectId={projectId}
                    />
                  ))}
                </ul>
              </div>
            )}
          </div>

          <button
            className="mt-3 btn btn-secondary"
            onClick={() => navigate(`/todos/add?projectId=${projectId}`)}
          >
            + Add New Todo
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
