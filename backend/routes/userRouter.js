const express = require('express');
const userRouter = express.Router();
const {getCurrentUser,updateAssistant, askToAssistant} = require("../controllers/user-controller")
const isAuth = require("../middleware/isAuth")
const upload= require("../middleware/multer")

userRouter.get("/current",isAuth, getCurrentUser);
userRouter.post("/update",isAuth,upload.single("assistantImage"),updateAssistant);
userRouter.post('/asktoassistant', isAuth, askToAssistant);
module.exports = userRouter;