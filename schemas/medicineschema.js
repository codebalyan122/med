const mongoose = require("mongoose");

// Define the schema
const Medicine = mongoose.model("medicine", mongoose.Schema({}), "medicine");
