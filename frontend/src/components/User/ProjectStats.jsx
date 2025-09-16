import React from "react";

const ProjectStats = ({ stats }) => {
  if (!stats) return null; // optional: handle null stats

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-6 my-5">
      {/* Total Todos */}
      <div className="p-5 bg-red-50 rounded-xl border border-red-200 transform hover:scale-105 transition-all duration-300 text-center">
        <h3 className="font-semibold text-lg text-red-700 mb-1">Total Todos</h3>
        <p className="text-2xl font-bold text-red-800">{stats.total_todos}</p>
      </div>

      {/* Closed Todos */}
      <div className="p-5 bg-yellow-50 rounded-xl border border-yellow-200 transform hover:scale-105 transition-all duration-300 text-center">
        <h3 className="font-semibold text-lg text-yellow-700 mb-1">
          Closed Todos
        </h3>
        <p className="text-2xl font-bold text-yellow-800">
          {stats.closed_todos}
        </p>
      </div>

      {/* Open Todos */}
      <div className="p-5 bg-blue-50 rounded-xl border border-blue-200 transform hover:scale-105 transition-all duration-300 text-center">
        <h3 className="font-semibold text-lg text-blue-700 mb-1">Open Todos</h3>
        <p className="text-2xl font-bold text-blue-800">{stats.open_todos}</p>
      </div>
    </div>
  );
};

export default ProjectStats;
