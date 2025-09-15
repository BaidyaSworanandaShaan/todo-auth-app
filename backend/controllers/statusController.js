const pool = require("../config/db");

const getStatusController = async (_req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM status");

    res.status(200).json({
      success: true,
      status: rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getStatusController };
