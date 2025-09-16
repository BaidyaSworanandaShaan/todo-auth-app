import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import PageHeader from "../../../../components/PageHeader";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../context/AuthContext";
import { TodoSchema } from "../../../../validation/todoSchema";
import axios from "axios";
import { useProjects } from "../../../../hooks/useProjects";
import { useStatus } from "../../../../hooks/useStatus";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const AddTodo = () => {
  const { loading: authLoading, accessToken, user } = useAuth();
  const navigate = useNavigate();

  const {
    projects,
    loading: projectsLoading,
    error: projectsError,
  } = useProjects();

  const { status, loading: statusLoading, error: statusError } = useStatus();

  if (authLoading || projectsLoading || statusLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-lg">Loading...</p>
      </div>
    );
  }

  if (projectsError)
    return <p className="text-red-500">Failed to load projects</p>;
  if (statusError)
    return <p className="text-red-500">Failed to load status options</p>;

  const handleTodoSubmit = async (values, { resetForm }) => {
    try {
      const payload = {
        ...values,
        tags: values.tags
          ? values.tags.split(",").map((tag) => tag.trim())
          : [],
      };

      const response = await axios.post(`${BACKEND_URL}/todos`, payload, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (response.status === 201) {
        alert("Todo added successfully!");
        resetForm();
        navigate("/dashboard");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add todo");
      console.error(error);
    }
  };

  return (
    <div className="p-10 mx-4 md:mx-10">
      <PageHeader title="Add Todo" />

      <div className="mt-5 p-6    bg-white">
        <Formik
          initialValues={{
            title: "",
            description: "",
            assignee_id: user?.id,
            project_id: "",
            status_id: "",
            due_date: "",
            priority: 1,
            tags: "",
            estimateHours: "",
          }}
          validationSchema={TodoSchema}
          onSubmit={handleTodoSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              {/* Title */}
              <div className="mb-4">
                <label className="block font-medium text-gray-700 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <Field
                  type="text"
                  name="title"
                  placeholder="Enter todo title"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                  required
                />
                <ErrorMessage
                  name="title"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Project */}
              <div className="mb-4">
                <label className="block font-medium text-gray-700 mb-1">
                  Project <span className="text-red-500">*</span>
                </label>
                <Field
                  as="select"
                  name="project_id"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                  required
                >
                  <option value="">Select project</option>
                  {projects.map((project) => (
                    <option key={project.project_id} value={project.project_id}>
                      {project.project_name}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="project_id"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Status, Due Date, Priority, Estimate Hours */}
              <div className="flex gap-5">
                <div className="flex-1">
                  <label className="block font-medium text-gray-700 mb-1">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <Field
                    as="select"
                    name="status_id"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                    required
                  >
                    <option value="">Select status</option>
                    {status.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="status_id"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div className="flex-1">
                  <label className="block font-medium text-gray-700 mb-1">
                    Due Date <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="date"
                    name="due_date"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                    required
                  />
                  <ErrorMessage
                    name="due_date"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div className="flex-1">
                  <label className="block font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <Field
                    type="number"
                    name="priority"
                    min={1}
                    max={5}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                  <ErrorMessage
                    name="priority"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
                <div className="flex-1">
                  <label className="block font-medium text-gray-700 mb-1">
                    Estimate Hours
                  </label>
                  <Field
                    type="number"
                    name="estimate_hours"
                    min={0}
                    step={0.1}
                    placeholder="Enter estimated hours"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                  <ErrorMessage
                    name="estimate_hours"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              </div>

              {/* Tags */}
              <div className="mb-6 mt-4">
                <label className="block font-medium text-gray-700 mb-1">
                  Tags (comma separated)
                </label>
                <Field
                  type="text"
                  name="tags"
                  placeholder="e.g., frontend, design, UI"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={
                  isSubmitting || projects.length === 0 || status.length === 0
                }
                className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 transition-colors"
              >
                {isSubmitting ? "Adding..." : "+ Add Todo"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddTodo;
