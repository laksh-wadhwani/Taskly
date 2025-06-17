const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    fullname: String,
    email: String,
    password: String,
    OTP: String,
    otpExpiry: Date,
    profile: String,
    isVerified: {type:Boolean, default:false}
})

const UserModel = new mongoose.model("User", UserSchema)

module.exports = UserModel