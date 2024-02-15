// Import necessary modules
const express = require("express");
const mongoose = require("mongoose");
const Medicine = mongoose.model("medicine", mongoose.Schema({}), "medicine"); // Import your Mongoose schema definition

// Create an instance of Express
const app = express();
const port = process.env.PORT || 3000; // Set the port number

// Connect to MongoDB
mongoose.connect(
  "mongodb+srv://balyancode122:balyancode122@cluster0.ej1mkoh.mongodb.net/medicalbabu1"
);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB database");
});

// Route to fetch medicine data
app.get("/api", async (req, res) => {
  try {
    const medicine = await Medicine.find();
    res.json(medicine);
  } catch (err) {
    console.error("Error fetching medicines:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
