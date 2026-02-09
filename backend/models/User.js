const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  createdAt:{ type:Date,index:true},
  email: { type: String, unique: true },
  password: String,
  role:{
    type:String,
    default:"user",
  },
  isAdmin:{
    type:String,
    default:false,
  },
  isVerified:{
    type:Boolean,
    default:false,
  },
});

module.exports = mongoose.model("User", userSchema);
