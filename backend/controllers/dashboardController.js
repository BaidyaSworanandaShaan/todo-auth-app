const {
  getOverdueTodos,
  getProjectsNoTodos,
  getAssignedNonClosedCount,
} = require("../services/dashboardServices");

const getDashboardStatsController = async (req, res) => {
  try {
    const userId = req.user.id;

    const [overdueTodos, projectsNoTodos, assignedNonClosed] =
      await Promise.all([
        getOverdueTodos(userId),
        getProjectsNoTodos(),
        getAssignedNonClosedCount(userId),
      ]);

    res.status(200).json({
      success: true,
      data: {
        overdueTodos,
        projectsNoTodos,
        assignedNonClosed,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getDashboardStatsController };
