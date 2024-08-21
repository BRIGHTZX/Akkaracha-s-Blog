import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import postRoutes from "./routes/post.route.js";
import commentRoutes from "./routes/comment.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Mongo is connected");
  })
  .catch((error) => {
    console.log(error);
  });

const __dirname = path.resolve();
const app = express();

// CORS middleware
app.use(
  cors({
    origin: ["https://akkarachas-blog.onrender.com", "http://localhost:5173"], // กำหนดโดเมนที่อนุญาต
    methods: ["GET", "POST", "PUT", "DELETE"], // กำหนดวิธีการที่อนุญาต
    credentials: true, // เปิดใช้งานการส่งคุกกี้และข้อมูลการรับรองอื่นๆ
  })
);

// Middleware for setting COEP and CORS headers
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  next();
});

app.use(express.json());
app.use(cookieParser());

// API Routes
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/post", postRoutes);
app.use("/api/comment", commentRoutes);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "Client", "dist")));

// Handle all other routes with the React app
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "Client", "dist", "index.html"));
});

// Control status and error
app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

app.listen(4000, () => {
  console.log("Server running on port 4000");
});
