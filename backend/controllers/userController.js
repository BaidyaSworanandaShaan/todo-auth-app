const pool = require("../config/db");

const getAllUserController = async (_req, res) => {
  try {
    const [rows] = await pool.query("SELECT id, email,name FROM users");

    res.status(200).json({
      success: true,
      users: rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getAllUserController };
