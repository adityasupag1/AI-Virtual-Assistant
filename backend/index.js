const express = require("express");
const dotenv = require("dotenv");
const cors = require('cors')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
require('dotenv').config()
const connecDB = require('./config/db')
connecDB();
const port = process.env.PORT || 5000
const app = express()
const authRouter= require('./routes/authRouter');
const userRouter = require("./routes/userRouter");
const geminiResponse = require('./gemini')
//Middlewares
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

// ✅ CORS CONFIG (THIS FIXES YOUR ERROR)
app.use(
  cors({
    origin: "http://localhost:5173", // Vite frontend
    credentials: true
  })
);

app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)

app.listen(port,()=>{
  console.log("server is running ")
})


