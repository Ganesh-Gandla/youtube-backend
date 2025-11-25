import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protectRoute = async (req, res, next) => {
  try {
    let token;

    // Token should be sent in Authorization header
    if (
      req.headers.authorization && 
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // No token found
    if (!token) {
      return res.status(401).json({ message: "Not authorized, token missing" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user by userId stored in token
    const user = await User.findOne({ userId: decoded.userId }).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user; // Attach user to request object

    next(); // Continue to protected route
  } catch (error) {
    console.error("JWT Authentication Error:", error);

    return res.status(401).json({
      message: "Not authorized, invalid or expired token",
    });
  }
};
