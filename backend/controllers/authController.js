const bcrypt = require("bcrypt");
const pool = require("../config/db");
const JWT = require("jsonwebtoken");

// =================== REGISTER ===================
const registerController = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let { role } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please fill all required fields" });
    }
    if (!role) {
      role = "user";
    }
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
      "INSERT INTO users (email, password_hash, name, role) VALUES (?, ?, ?, ?)",
      [email, hashedPwd, name, role]
    );

    res.status(201).json({
      message: "User registered successfully.",
      userId: result.insertId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// =================== LOGIN ===================
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please fill all required fields" });
    }

    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    const user = rows[0];
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    // Create access token
    const accessToken = JWT.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // Create refresh token
    const refreshToken = JWT.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
    });

    // Remove old refresh token
    await pool.query("DELETE FROM refresh_tokens WHERE user_id = ?", [user.id]);

    // Insert new refresh token in DB
    await pool.query(
      "INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY))",
      [user.id, refreshToken]
    );

    // Set cookie (dev-friendly)
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // must be false for localhost
      sameSite: "Lax", // allow cross-site cookies on localhost
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/",
    });

    res.json({
      message: "Login successful",
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// =================== LOGOUT ===================

const logoutController = async (req, res) => {
  try {
    const refreshToken = req?.cookie?.refreshToken;

    if (refreshToken) {
      await pool.query("DELETE FROM refresh_tokens WHERE token = ?", [
        refreshToken,
      ]);
    }
    res.cookie("refreshToken", "", {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      maxAge: 0,
      path: "/",
    });
    res.json({ message: "Logged out successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
// =================== REFRESH TOKEN ===================
const refreshTokenController = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    console.log("Refresh Token", refreshToken);
    if (!refreshToken)
      return res.status(400).json({ message: "Refresh token required" });

    // Check if refresh token exists in DB
    const [rows] = await pool.query(
      "SELECT * FROM refresh_tokens WHERE token = ?",
      [refreshToken]
    );

    if (rows.length === 0)
      return res.status(403).json({ message: "Invalid refresh token" });

    // Verify JWT
    let decoded;
    try {
      decoded = JWT.verify(refreshToken, process.env.JWT_SECRET_KEY);
    } catch (err) {
      return res
        .status(403)
        .json({ message: "Refresh token expired or invalid" });
    }

    const userId = decoded.id;

    // Get user info
    const [userRows] = await pool.query(
      "SELECT id, email, role FROM users WHERE id = ?",
      [userId]
    );
    if (userRows.length === 0)
      return res.status(404).json({ message: "User not found" });

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

    // ✅ Replace old token instead of UPDATE
    await pool.query("DELETE FROM refresh_tokens WHERE user_id = ?", [user.id]);
    await pool.query(
      "INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY))",
      [user.id, newRefreshToken]
    );

    // Set new cookie
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.json({ accessToken, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  registerController,
  loginController,
  logoutController,
  refreshTokenController,
};
