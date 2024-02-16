// Import necessary modules
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const User = require("./schemas/User"); // Import your User model

// Create an instance of Express
const app = express();
const port = process.env.PORT || 3000; // Set the port number
const Medicine = mongoose.model("medicine", mongoose.Schema({}), "medicine");

// Connect to MongoDB
mongoose.connect(
  "mongodb+srv://balyancode122:balyancode122@cluster0.ej1mkoh.mongodb.net/medicalbabu1"
);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB database");
});

// Middleware setup
app.use(bodyParser.json());
app.use(cors());

app.get("/medicine", async (req, res) => {
  try {
    const medicine = await Medicine.find();
    res.json(medicine);
  } catch (err) {
    console.error("Error fetching medicines:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Route to register a new user
app.post("/register", async (req, res) => {
  try {
    const { companyName, email, number, password } = req.body;
    // Check if the username already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    // Create a new user
    const newUser = new User({ companyName, email, number, password });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Route to authenticate a user
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    // Find the user by username and password
    const user = await User.findOne({ username, password });
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    res.json({ message: "Login successful" });
  } catch (err) {
    console.error("Error authenticating user:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
