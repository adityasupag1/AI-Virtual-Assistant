
const userModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/token");

// Centralized cookie configuration
// Helps avoid duplication and mistakes
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: false,
  sameSite: "lax",
  path: "/",          // 🔥 REQUIRED
  maxAge: 7 * 24 * 60 * 60 * 1000
};

/**
 * =========================
 * SIGNUP CONTROLLER
 * =========================
 */
module.exports.signup = async (req, res) => {
  try {
    // Extract user input from request body
    const { name, email, password } = req.body;

    // Basic input validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Password strength validation
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long"
      });
    }

    // Check if user already exists
    const existUser = await userModel.findOne({ email });
    if (existUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    // Hash password before saving (never store plain text passwords)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user in database
    const user = await userModel.create({
      name,
      email,
      password: hashedPassword
    });

    // Generate JWT token (payload kept minimal)
    const token = await generateToken({
      id: user._id,
      email: user.email
    });

    // Store token securely in HTTP-only cookie
    res.cookie("token", token, COOKIE_OPTIONS);

    // Send safe user data (NEVER send password)
    return res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email
    });

  } catch (error) {
    // Avoid exposing internal error details
    return res.status(500).json({ message: "Signup failed" });
  }
};

/**
 * =========================
 * LOGIN CONTROLLER
 * =========================
 */
module.exports.login = async (req, res) => {
  try {
    // Extract credentials
    const { email, password } = req.body;

    // Find user by email
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare entered password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate new JWT token on successful login
    const token =await generateToken({
      id: user._id,
      email: user.email
    });

    // Store token in secure cookie
    res.cookie("token", token, COOKIE_OPTIONS);

    // Respond with non-sensitive user data
    return res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email
    });

  } catch (error) {
    return res.status(500).json({ message: "Login failed" });
  }
};

/**
 * =========================
 * LOGOUT CONTROLLER
 * =========================
 */
module.exports.logout = async (req, res) => {
  try {
    // Clear authentication cookie
    res.clearCookie("token", COOKIE_OPTIONS);

    return res.status(200).json({
      message: "Logged out successfully"
    });

  } catch (error) {
    return res.status(500).json({ message: "Logout failed" });
  }
};
