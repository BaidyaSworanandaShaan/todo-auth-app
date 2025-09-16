import PageHeader from "../../../../components/PageHeader";
import { useProjectDetail } from "../../../../hooks/useProjectDetail";
import { useParams } from "react-router-dom";
import TodoItem from "../../../../components/User/TodoItem";
import ProjectStats from "../../../../components/User/ProjectStats";

const ProjectDetail = () => {
  const { id } = useParams();
  const { project, todos, stats, setTodos, loading, error } = useProjectDetail({
    projectId: id,
  });
  console.log("Stats", stats);
  if (loading) return <p className="p-10">Loading...</p>;
  if (error) return <p className="p-10">Error loading project</p>;
  if (!project) return <p className="p-10">Project not found</p>;

  return (
    <div className="p-10 md:mx-10 space-y-6">
      <PageHeader title="Project Detail" />
      {/* Project Stats */}

      {/* Project Card */}
      <div className=" p-6 border">
        <h2 className="text-xl font-semibold mb-2">{project.project_name}</h2>

        <p className="text-gray-600">
          Due Date: {new Date(project.project_due_date).toLocaleDateString()}
        </p>
        <p className="text-gray-600">
          Created At:{" "}
          {new Date(project.project_created_at).toLocaleDateString()}
        </p>
      </div>
      <ProjectStats stats={stats} />
      {/* Todos */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Todos</h3>
        {todos?.length === 0 ? (
          <p className="text-gray-500">No todos yet</p>
        ) : (
          <div className="mb-5">
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {todos.map((todo) => (
                <TodoItem key={todo.id} todo={todo} setTodos={setTodos} />
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetail;
