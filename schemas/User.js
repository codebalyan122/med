const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  companyName: String,
  email: String,
  number: String,
  password: String,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
