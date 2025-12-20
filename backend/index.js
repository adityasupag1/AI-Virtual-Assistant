const express = require("express");
const dotenv = require("dotenv");
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

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.get("/", (req, res)=>{
  res.send("hey");
})

app.listen(port,()=>{
  console.log("server is running ")
})


