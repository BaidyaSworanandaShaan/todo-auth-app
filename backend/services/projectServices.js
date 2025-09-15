const pool = require("../config/db");
const createProject = async ({ name, owner_id, due_date }) => {
  const [result] = await pool.query(
    "INSERT INTO projects (name, owner_id, due_date) VALUES (?, ?, ?)",
    [name, owner_id, due_date]
  );
  return result.insertId; // return the new project ID
};

const getAllProjectsOfUser = async (userId) => {
  const [rows] = await pool.query(
    `SELECT p.id, p.name, p.due_date, p.created_at, u.name AS owner_name
     FROM projects p
     JOIN users u ON p.owner_id = u.id
     WHERE p.owner_id = ?
     ORDER BY p.created_at DESC`,
    [userId]
  );

  return { projects: rows };
};

module.exports = {
  createProject,
  getAllProjectsOfUser,
};
