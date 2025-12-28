const userModel = require("../models/user-model");
const uploadOnCloudinary = require("../config/cloudinary");
const { response } = require("express");
const moment = require('moment')
const generateResponse = require("../gemini")
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



module.exports.askToAssistant = async (req, res) => {
  try {
    const { command } = req.body;
    const userId = req.userId;

    const user = await userModel.findById(userId);
    const assistantName = user.assistantName;
    const userName = user.name;


    const aiResult = await generateResponse(
      command,
      assistantName,
      userName
    );

    if (user) {
      if (!Array.isArray(user.history)) {
        user.history = [];
      }

      user.history.push({ command });

      await user.save();
    }



    switch (aiResult.type) {
      case "get_time":
        return res.json({
          ...aiResult,
          response: `Current time is ${moment().format("hh:mm A")}`
        });

      case "get_date":
        return res.json({
          ...aiResult,
          response: `Today's date is ${moment().format("YYYY-MM-DD")}`
        });

      case "get_day":
        return res.json({
          ...aiResult,
          response: `Today is ${moment().format("dddd")}`
        });

      case "get_month":
        return res.json({
          ...aiResult,
          response: `Current month is ${moment().format("MMMM")}`
        });

      // frontend actions
      case "google_search":
      case "youtube_search":
      case "youtube_play":
      case "calculator_open":
      case "instagram_open":
      case "facebook_open":
      case "weather_show":
      case "general":
      default:
        return res.json(aiResult);
    }

  } catch (err) {
    console.error("askToAssistant error:", err);
    return res.status(500).json({
      type: "general",
      userinput: "",
      response: "Server error while processing command."
    });
  }
};
