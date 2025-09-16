import React from "react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
import { Formik, Form, Field, ErrorMessage } from "formik";

import axios from "axios";
import PageHeader from "../../../../components/PageHeader";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../context/AuthContext";
import { ProjectSchema } from "../../../../validation/projectSchema";

const AddProjects = () => {
  const { loading, accessToken } = useAuth();
  const navigate = useNavigate();
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-lg">Loading...</p>
      </div>
    );
  }

  const handleProjectSubmit = async (values, { resetForm }) => {
    try {
      console.log(values);

      const response = await axios.post(`${BACKEND_URL}/projects`, values, {
        headers: { Authorization: `Bearer ${accessToken}` },
        withCredentials: true,
      });
      if (response.status === 201) {
        alert("Projects added successfully!");
        navigate("/dashboard");
        resetForm();
      }
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message || "Failed to add Projects");
      } else if (error.request) {
        alert("No response from server");
      } else {
        alert("Something went wrong");
      }
      console.error("Error adding Projects:", error);
    }
  };

  return (
    <div className="p-10 mx-4 md:mx-10">
      <PageHeader title={"Add Projects"} />

      <div className="mt-5">
        <Formik
          initialValues={{
            name: "",
            dueDate: "", // <-- added dueDate
          }}
          validationSchema={ProjectSchema}
          onSubmit={handleProjectSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="flex gap-4">
                {/* Title */}
                <div className="flex-1 mb-4">
                  <label className="block text-gray-700 font-medium mb-2">
                    Project's Name
                  </label>
                  <Field
                    type="text"
                    name="name"
                    placeholder="Enter project's name"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Due Date */}
                <div className="w-1/3 mb-6">
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
                {isSubmitting ? "Adding..." : "+ Add Projects"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddProjects;
