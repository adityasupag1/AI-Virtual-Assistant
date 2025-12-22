const jwt = require("jsonwebtoken");
const userModel = require('../models/user-model')


/**
 * Authentication middleware
 * -------------------------
 * 1. Reads JWT from HTTP-only cookie
 * 2. Verifies token integrity
 * 3. Confirms user still exists
 * 4. Attaches userId to request
 */
const isAuth = async (req, res, next) => {
  try {
    // Read token from cookies (safe access)
    const token = req.cookies?.token;
   

    // If no token, user is not authenticated
    if (!token) {
      return res.status(401).json({
        message: "Authentication required"
      });
    }

    // Verify JWT and extract payload
    const decoded = jwt.verify( token,process.env.JWT_SECRET );

    // Find user in database using decoded ID
    const user = await userModel.findById(decoded.id);

    // If user no longer exists
    if (!user) {
      return res.status(401).json({message: "User not found"});
    }

    // Attach authenticated user info to request
    req.userId = user._id;
    console.log(user._id);
    // Allow request to proceed
   

    next();

  } catch (error) {
    // Token is invalid or expired
    console.log("VERIFY SECRET:", process.env.JWT_SECRET);

    return res.status(401).json({
      message: "Invalid or expired token",
      data : `${process.env.JWT_SECRET}`
    });
  }
};

module.exports = isAuth;
