// Import necessary modules
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
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
    const medicine = await Medicine.find().limit(10);
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
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      companyName,
      email,
      number,
      password: hashedPassword,
    });
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
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    // Compare the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    // Generate JWT token
    const token = jwt.sign(
      { email: user.email, userId: user._id },
      "askjskjdvdkjfnvdkfnlkdfnkldfnldfkn",
      { expiresIn: "1h" }
    );
    res.status(200).json({ token: token });
  } catch (err) {
    console.error("Error authenticating user:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});
// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
