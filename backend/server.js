// server.js
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
const port = process.env.PORT || 5000;

// DB connection
const db = require("./config/db");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

// CORS configuration
const corsOptions = {
  origin: "http://localhost:5173", // frontend URL
  credentials: true, // allow cookies to be sent
  allowedHeaders: ["Content-Type", "Authorization"], // allow custom headers
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"], // allowed HTTP methods
};

app.use(cors(corsOptions));

// Routes
app.use("/auth", require("./routes/authRoutes"));
app.use("/todos", require("./routes/todoRoutes"));
app.use("/projects", require("./routes/projectRoutes"));
app.use("/users", require("./routes/userRoutes"));
app.use("/status", require("./routes/statusRoutes"));

// Start server
app.listen(port, () => {
  console.log(`Server running on PORT: ${port}`);
});
