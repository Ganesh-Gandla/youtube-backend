import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import channelRoutes from "./routes/channelRoutes.js";


dotenv.config();

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Connect Database
connectDB();

// Test route
app.get("/", (req, res) => {
  res.send("YouTube Clone Backend Running...");
});

// Custom routes
app.use("/api/auth", authRoutes);
app.use("/api/channel", channelRoutes);


const PORT = process.env.PORT || 5100;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
