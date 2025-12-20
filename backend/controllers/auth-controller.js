const userModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/token")

module.exports.signup = async (req, res) => {
  const { name, email, password } = req.body;
  const existEmail =await userModel.findOne({ email });

  // email checking
  if (existEmail) {
    return res.status(400).json({message: "email already exist"})
  }

  // password length checking
  if(password.length<6){
    return res.status(400).json({message : "password must be atleast 6 characters !"});
  }

  // Password hashing
  const salt =await bcrypt.genSalt(10)
  const hashPassword =await bcrypt.hash(password, salt);

  // storing new user data
  const user = await userModel.create({ name, email, password: hashPassword })

  // generate token
  const token =await generateToken({email: user.email,_id:user._id})
  res.cookie("token", token, {
    httpOnly : true,
    secure : false,
    sameSite: "strict",
    maxAge: 7*24*60*60*1000
  })
}