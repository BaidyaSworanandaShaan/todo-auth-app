import React, { useEffect } from "react";
import { registrationSchema } from "../../validation/registrationSchema";
import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Register = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const initialValues = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  };
  useEffect(() => {
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);
  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/auth/register`, {
        name: values.username,
        email: values.email,
        password: values.password,
      });
      alert(response.data.message);
      resetForm();
      navigate("/login", { replace: true });
    } catch (error) {
      if (error.reponse) {
        alert(error.response.data.message);
      } else {
        alert(error.response.data.error);
        console.error("Error:", error.response.data.error);
      }
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm p-6 bg-white rounded-xl shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 text-center mb-4">
          Create your Account
        </h2>

        <Formik
          initialValues={initialValues}
          validationSchema={registrationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              {/* Username */}
              <div>
                <Field
                  name="username"
                  type="text"
                  placeholder="Username"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                />
                <ErrorMessage
                  name="username"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Email */}
              <div>
                <Field
                  name="email"
                  type="email"
                  placeholder="Email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Password */}
              <div>
                <Field
                  name="password"
                  type="password"
                  placeholder="Password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <Field
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm Password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                />
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary btn"
              >
                {isSubmitting ? "Registering..." : "Register"}
              </button>
            </Form>
          )}
        </Formik>

        <span className="mt-2 block text-center">
          Already have an account ?{" "}
          <Link to="/login" className="underline">
            Login
          </Link>
        </span>
      </div>
    </div>
  );
};

export default Register;
