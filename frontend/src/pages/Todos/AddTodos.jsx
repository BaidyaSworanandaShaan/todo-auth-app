import React from "react";
import { useAuth } from "../../context/AuthContext";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
import { Formik, Form, Field, ErrorMessage } from "formik";
import { TodoSchema } from "../../validation/todoSchema";

import axios from "axios";
import PageHeader from "../../components/PageHeader";
import { useNavigate } from "react-router-dom";

const AddTodo = () => {
  const { loading, accessToken } = useAuth();
  const navigate = useNavigate();
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-lg">Loading...</p>
      </div>
    );
  }

  const handleTodoSubmit = async (values, { resetForm }) => {
    try {
      console.log(values);

      const response = await axios.post(`${BACKEND_URL}/todos`, values, {
        headers: { Authorization: `Bearer ${accessToken}` },
        withCredentials: true,
      });
      if (response.status === 201) {
        alert("Todo added successfully!");
        navigate("/dashboard");
        resetForm();
      }
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message || "Failed to add todo");
      } else if (error.request) {
        alert("No response from server");
      } else {
        alert("Something went wrong");
      }
      console.error("Error adding todo:", error);
    }
  };

  return (
    <div className="p-10 mx-4 md:mx-10">
      <PageHeader title={"Add Todo"} />

      <div className="mt-5">
        <Formik
          initialValues={{
            title: "",
            description: "",
            status: "pending",
            dueDate: "", // <-- added dueDate
          }}
          validationSchema={TodoSchema} // make sure to add dueDate validation if needed
          onSubmit={handleTodoSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              {/* Title */}
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Title
                </label>
                <Field
                  type="text"
                  name="title"
                  placeholder="Enter todo title"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
                <ErrorMessage
                  name="title"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Description
                </label>
                <Field
                  as="textarea"
                  name="description"
                  placeholder="Enter todo description (optional)"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div className="flex gap-3">
                {/* Status */}
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">
                    Status
                  </label>
                  <Field
                    as="select"
                    name="status"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                  </Field>
                  <ErrorMessage
                    name="status"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Due Date */}
                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">
                    Due Date
                  </label>
                  <Field
                    type="date"
                    name="due_date"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                  <ErrorMessage
                    name="due_date"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-green-600 text-white btn hover:bg-green-700"
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
