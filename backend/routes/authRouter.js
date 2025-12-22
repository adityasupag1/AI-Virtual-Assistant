const express = require('express');
const authRouter = express.Router();
const {signup, login , logout} = require('../controllers/auth-controller')
authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.get("/logout", logout);

module.exports = authRouter;