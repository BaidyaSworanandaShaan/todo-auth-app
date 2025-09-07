const bcrypt = require("bcrypt");
const pool = require("../config/db");
const JWT = require("jsonwebtoken");
const registerController = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please fill all required fields" });
    }

    const [existingUser] = await pool.query(
      "Select id from USERS where email = ? ",
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

const loginController = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please fill all required fields" });
  }

  try {
    const [rows] = await pool.query("Select * from users where email = ? ", [
      email,
    ]);

    const user = rows[0];
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    console.log(user);

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).send({
        success: false,
        message: "Invalid Credentials",
      });
    }

    // Create token to issue user
    const tokenPaylod = { id: user.id, email: user.email, role: user.role };
    const accessToken = JWT.sign(tokenPaylod, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    const refreshToken = JWT.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
    });

    //Delete previous stored refresh token
    await pool.query("DELETE FROM refresh_tokens WHERE user_id = ?", [user.id]);

    await pool.query(
      "INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY))",
      [user.id, refreshToken]
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.json({
      message: "Login successful",
      accessToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const refreshTokenController = async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    return res.status(400).json({ message: "Refresh token is required" });
  }

  try {
    const [rows] = await pool.query(
      "SELECT * FROM refresh_tokens Where token = ?",
      [refreshToken]
    );

    if (rows.length === 0) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const tokenData = rows[0];

    try {
      const decoded = JWT.verify(refreshToken, process.env.JWT_SECRET_KEY);
      const userId = decoded.id;

      const [userRows] = await pool.query(
        "SELECT id, email, role FROM users WHERE id = ?",
        [userId]
      );

      if (userRows.length === 0)
        return res.status(404).json({ message: "User not found" });

      const user = userRows[0];

      const accessToken = JWT.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET_KEY,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      const newRefreshToken = JWT.sign(
        { id: user.id },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
        }
      );

      await pool.query(
        "UPDATE refresh_tokens SET token = ?, expires_at = DATE_ADD(NOW(), INTERVAL 7 DAY) WHERE token = ?",
        [newRefreshToken, refreshToken]
      );

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // HTTPS only in production
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
      res.json({ accessToken });
    } catch (err) {
      return res
        .status(403)
        .json({ message: "Invalid or expired refresh token" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
module.exports = {
  registerController,
  loginController,
  refreshTokenController,
};
