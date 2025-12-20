const jwt = require('jsonwebtoken')
const generateToken= async (data)=>{
   try{
      const token = jwt.sign(data,process.env.JWT_SECRET,{expiresIn : "7d"})
       return token;
   } catch(error){

   }
}

module.exports = generateToken;