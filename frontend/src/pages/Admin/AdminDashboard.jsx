import React, { useEffect, useState } from "react";
import PageHeader from "../../components/PageHeader";
import { useAuth } from "../../context/AuthContext";
import api from "../../api";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const AdminDashboard = () => {
  const { user, accessToken } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(5);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get(`${BACKEND_URL}/users`, {
          headers: { Authorization: `Bearer ${accessToken}` },
          withCredentials: true,
        });
        console.log(res.data);
        setUsers(res.data.users);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(users.length / usersPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  return (
    <div className="p-10 md:mx-10">
      <PageHeader title="Admin Dashboard" />
      <span className="font-semibold text-xl block my-5">
        Hello, {user?.email}! 👋
      </span>

      {loading ? (
        <p>Loading users...</p>
      ) : (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-4">List of all Users</h2>

          {/* Users List */}
          <div className="space-y-3">
            {currentUsers?.map((u) => (
              <div
                key={u.id}
                className="flex items-center justify-between p-4 border rounded-lg shadow-sm bg-white"
              >
                <div className="flex flex-col">
                  <span className="font-medium">{u.name}</span>
                  <span className="text-gray-500 text-sm">{u.email}</span>
                </div>
                <button
                  // onClick={() => handleDelete(u.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-6">
            <div className="space-x-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => handlePageChange(i + 1)}
                  className={`px-3 py-1 rounded-lg ${
                    currentPage === i + 1
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            {/* Rows per page dropdown */}
            <select
              value={usersPerPage}
              onChange={(e) => {
                setUsersPerPage(Number(e.target.value));
                setCurrentPage(1); // reset to page 1 when limit changes
              }}
              className="border px-2 py-1 rounded-lg"
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
