const JWT = require("jsonwebtoken");
const authMiddleware = async (req, res, next) => {
  try {
    const authHeaders = req.headers["authorization"];
    if (!authHeaders) {
      return res
        .status(401)
        .json({ success: false, message: "No token provided" });
    }

    const accessToken = authHeaders.split(" ")[1];
    if (!accessToken) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid token format" });
    }

    const decoded = JWT.verify(accessToken, process.env.JWT_SECRET_KEY);
    req.user = { id: decoded.id, email: decoded.email, role: decoded.role };
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      success: false,
      message: "Unauthorized or token expired",
      error: error.message,
    });
  }
};

module.exports = authMiddleware;
