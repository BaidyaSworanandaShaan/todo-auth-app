import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import PageHeader from "../../../../components/PageHeader";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useAuth } from "../../../../context/AuthContext";
import { TodoSchema } from "../../../../validation/todoSchema";

import { useStatus } from "../../../../hooks/useStatus";
import { useProjectDetail } from "../../../../hooks/useProjectDetail";
import api from "../../../../api";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const AddTodo = () => {
  const { loading: authLoading, accessToken, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("projectId");

  const {
    project,
    loading: projectLoading,
    error: projectError,
  } = useProjectDetail({ projectId });

  const { status, loading: statusLoading, error: statusError } = useStatus();

  if (authLoading || projectLoading || statusLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-lg">Loading...</p>
      </div>
    );
  }

  if (projectError)
    return <p className="text-red-500">Failed to load project</p>;
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

      const response = await api.post(`${BACKEND_URL}/todos`, payload, {
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

      <div className="mt-5">
        <Formik
          initialValues={{
            title: "",
            description: "",
            assignee_id: user?.id,
            project_id: project?.project_id,
            status_id: "",
            due_at: "",
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
                  Project
                </label>
                <Field
                  type="hidden"
                  name="project_id"
                  value={project.project_id}
                />

                {/* Disabled input to show project name */}
                <input
                  type="text"
                  value={project.project_name} // what user sees
                  disabled
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 text-gray-700 cursor-not-allowed focus:outline-none"
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
                    name="due_at"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                    required
                  />
                  <ErrorMessage
                    name="due_at"
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
                disabled={isSubmitting || status.length === 0}
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
