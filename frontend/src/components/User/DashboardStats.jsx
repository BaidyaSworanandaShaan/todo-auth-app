import React from "react";
import { useDashboardStats } from "../../hooks/useDashboardStats";

const DashboardStats = () => {
  const { dashboardStats, loading, error } = useDashboardStats();

  if (loading) return <p className="text-gray-500">Loading stats...</p>;
  if (error) return <p className="text-red-500">Failed to load stats</p>;
  if (!dashboardStats) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-6 my-5">
      {/* Overdue Todos */}
      <div className="p-5 bg-red-50 rounded-xl border border-red-200  transform hover:scale-105 transition-all duration-300 text-center">
        <div className="flex justify-center mb-2">
          <span className="text-red-500 text-3xl">⏰</span>
        </div>
        <h3 className="font-semibold text-lg text-red-700 mb-1">
          Overdue Todos
        </h3>
        <p className="text-2xl font-bold text-red-800">
          {dashboardStats.overdueTodos.length}
        </p>
      </div>

      {/* Projects With No Todos */}
      <div className="p-5 bg-yellow-50 rounded-xl border border-yellow-200 transform hover:scale-105 transition-all duration-300 text-center">
        <div className="flex justify-center mb-2">
          <span className="text-yellow-500 text-3xl">📁</span>
        </div>
        <h3 className="font-semibold text-lg text-yellow-700 mb-1">
          Projects With No Todos
        </h3>
        <p className="text-2xl font-bold text-yellow-800">
          {dashboardStats.projectsNoTodos.length}
        </p>
      </div>

      {/* Non-Closed Todos */}
      <div className="p-5 bg-blue-50 rounded-xl border border-blue-200 transform hover:scale-105 transition-all duration-300 text-center">
        <div className="flex justify-center mb-2">
          <span className="text-blue-500 text-3xl">📝</span>
        </div>
        <h3 className="font-semibold text-lg text-blue-700 mb-1">
          Non-Closed Todos
        </h3>
        <p className="text-2xl font-bold text-blue-800">
          {dashboardStats.assignedNonClosed.non_closed_count}
        </p>
      </div>
    </div>
  );
};

export default DashboardStats;
