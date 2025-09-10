const bcrypt = require("bcrypt");
const pool = require("../config/db");
const JWT = require("jsonwebtoken");
const {
  registerUser,
  refreshAccessToken,
  logoutUser,
  loginUser,
} = require("../services/authServices");

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
    const userId = await registerUser({ name, email, password, role });
    res.status(201).json({
      message: "User registered successfully.",
      userId,
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

    const { user, accessToken, refreshToken } = await loginUser({
      email,
      password,
    });

    // set cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // true in production
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.json({
      message: "Login successful",
      accessToken,
      user,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message || "Server error" });
  }
};

// =================== LOGOUT ===================

const logoutController = async (req, res) => {
  try {
    const refreshToken = req?.cookie?.refreshToken;

    await logoutUser(refreshToken);
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

    const { accessToken, newRefreshToken, user } = await refreshAccessToken(
      refreshToken
    );

    // set new cookie
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: false, // true in prod
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.json({ accessToken, user });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message || "Server error" });
  }
};

module.exports = {
  registerController,
  loginController,
  logoutController,
  refreshTokenController,
};
