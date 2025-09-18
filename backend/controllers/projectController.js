const {
  createProject,
  getAllProjectsOfUser,

  getSingleProjectWithTodo,
  getSingleProjectStats,
  deleteProject,
} = require("../services/projectServices");

const createProjectController = async (req, res) => {
  try {
    const { name, due_date } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Project name is required" });
    }

    const projectId = await createProject({
      name,
      owner_id: req.user.id,
      due_date,
    });

    res.status(201).json({
      message: "Project created successfully",
      projectId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

const getProjectController = async (req, res) => {
  try {
    const userId = req.user.id;

    const { projects } = await getAllProjectsOfUser(userId);

    res.status(200).json({ success: true, projects });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
const getProjectWithTodoController = async (req, res) => {
  try {
    const userId = req.user.id;
    const projectId = req.params.id;
    const { project, todos } = await getSingleProjectWithTodo(
      userId,
      projectId
    );

    res.status(200).json({ success: true, project, todos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
const getSingleProjectStatsController = async (req, res) => {
  try {
    const userId = req.user.id;
    const projectId = req.params.id;

    const { projectStats } = await getSingleProjectStats(userId, projectId);

    res.status(200).json({ success: true, projectStats });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteProjectController = async (req, res) => {
  try {
    const userId = req.user.id;
    const projectId = req.params.id;

    await deleteProject(userId, projectId);

    res
      .status(200)
      .json({ success: true, message: "Project deleted successfully" });
  } catch (error) {
    res
      .status(error.message === "Project not found" ? 404 : 500)
      .json({ message: error.message });
  }
};

module.exports = {
  createProjectController,
  getProjectController,
  getProjectWithTodoController,
  getSingleProjectStatsController,
  deleteProjectController,
};
