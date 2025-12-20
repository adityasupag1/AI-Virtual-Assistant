const mongoose = require("mongoose");
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL)
      .then(() => {
        console.log("Connected to MongoDb Atlas")
      })
  } catch (err) {
    console.log(err)
  }
}

module.exports = connectDB;
