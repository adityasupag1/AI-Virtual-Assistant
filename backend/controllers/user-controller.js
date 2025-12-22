const userModel = require("../models/user-model");
const uploadOnCloudinary = require("../config/cloudinary")

/**
 * Get currently logged-in user
 * Requires isAuth middleware before this controller
 */
module.exports.getCurrentUser = async (req, res) => {
  try {
    // userId was attached by isAuth middleware
    const userId = req.userId;

    // Fetch user from DB and exclude password
    const user = await userModel
      .findById(userId)
      .select("-password");

    // If user does not exist
    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // Send safe user data
    return res.status(200).json(user);

  } catch (error) {
    return res.status(500).json({
      message: "Get current user failed"
    });
  }
};


module.exports.updateAssistant = async (req, res) => {
  try {
    const { assistantName, imageUrl } = req.body;
     

    let assistantImage = imageUrl;

    if (req.file) {
      assistantImage = await uploadOnCloudinary(req.file.path);
    }


    const user = await userModel.findByIdAndUpdate(req.userId, { assistantName, assistantImage }, { new: true }).select("-password")

    return res.status(200).json(user);
  }
  catch (error) {
  console.log(error);
  return res.status(500).json({ error: error.message });
}

}