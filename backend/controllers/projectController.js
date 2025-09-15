const {
  createProject,
  getAllProjectsOfUser,
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
module.exports = {
  createProjectController,
  getProjectController,
};
