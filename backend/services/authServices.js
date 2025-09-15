const bcrypt = require("bcrypt");
const pool = require("../config/db");
const JWT = require("jsonwebtoken");

async function registerUser({ name, email, password, role = "user" }) {
  const [existingUser] = await pool.query(
    "SELECT id FROM users WHERE email = ?",
    [email]
  );

  if (existingUser.length > 0) {
    return res
      .status(400)
      .json({ error: "User with this email already exists." });
  }

  const hashedPwd = await bcrypt.hash(password, 10);
  const [result] = await pool.query(
    "INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)",
    [email, hashedPwd, name, role]
  );
  return result.insertId;
}

async function loginUser({ email, password }) {
  // check if user exists
  const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
    email,
  ]);
  const user = rows[0];

  if (!user) {
    throw new Error("User not found");
  }

  // validate password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  // access token
  const accessToken = JWT.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    process.env.JWT_SECRET_KEY,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  // refresh token
  const refreshToken = JWT.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
  });

  // remove old refresh token
  await pool.query("DELETE FROM refresh_tokens WHERE user_id = ?", [user.id]);

  // insert new refresh token
  await pool.query(
    "INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY))",
    [user.id, refreshToken]
  );

  return {
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
    accessToken,
    refreshToken,
  };
}
async function logoutUser(refreshToken) {
  if (refreshToken) {
    await pool.query("DELETE FROM refresh_tokens WHERE token = ?", [
      refreshToken,
    ]);
  }
  return true;
}
async function refreshAccessToken(refreshToken) {
  if (!refreshToken) {
    throw new Error("Refresh token required");
  }

  // Check if refresh token exists in DB
  const [rows] = await pool.query(
    "SELECT * FROM refresh_tokens WHERE token = ?",
    [refreshToken]
  );
  if (rows.length === 0) {
    throw new Error("Invalid refresh token");
  }

  // Verify JWT
  let decoded;
  try {
    decoded = JWT.verify(refreshToken, process.env.JWT_SECRET_KEY);
  } catch (err) {
    throw new Error("Refresh token expired or invalid");
  }

  const userId = decoded.id;

  // Get user info
  const [userRows] = await pool.query(
    "SELECT id, email, role, name FROM users WHERE id = ?",
    [userId]
  );
  if (userRows.length === 0) {
    throw new Error("User not found");
  }

  const user = userRows[0];

  // Generate new access token
  const accessToken = JWT.sign(
    { id: user.id, email: user.email, name: user.name, role: user.role },
    process.env.JWT_SECRET_KEY,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  // Rotate refresh token
  const newRefreshToken = JWT.sign(
    { id: user.id },
    process.env.JWT_SECRET_KEY,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN }
  );

  // Replace old token
  await pool.query("DELETE FROM refresh_tokens WHERE user_id = ?", [user.id]);
  await pool.query(
    "INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY))",
    [user.id, newRefreshToken]
  );

  return { accessToken, newRefreshToken, user };
}
module.exports = { registerUser, loginUser, logoutUser, refreshAccessToken };
