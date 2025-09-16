import React, { useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";

import { Link, useNavigate } from "react-router-dom";
import api from "../../api";
import { loginSchema } from "../../validation/loginSchema";

import { useAuth } from "../../context/AuthContext";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Login = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const initialValues = {
    email: "",
    password: "",
  };

  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        navigate("/admin-dashboard", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    try {
      const response = await api.post(`${BACKEND_URL}/auth/login`, values);
      const token = response.data.accessToken;
      const userData = response.data.user;
      login(token, userData);
      resetForm();
      if (userData.role === "admin") {
        navigate("/admin-dashboard", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message);
      } else {
        console.error("Error:", error);
        alert("Something went wrong");
      }
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm p-6 bg-white rounded-xl shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 text-center mb-4">
          Login to your Account
        </h2>

        <Formik
          initialValues={initialValues}
          validationSchema={loginSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
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

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn btn-primary"
              >
                {isSubmitting ? "Login..." : "Login"}
              </button>
            </Form>
          )}
        </Formik>
        <span className="mt-2 block text-center">
          Don't have an account ?{" "}
          <Link to="/register" className="underline">
            Register
          </Link>
        </span>
      </div>
    </div>
  );
};

export default Login;
