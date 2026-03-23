const express = require("express");
const cors = require("cors");
const connectDB = require('./src/config/db');
require("dotenv").config();

const app = express();

connectDB();
// Middleware
app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
  res.send("Crisis Intelligence API Running 🚀");
});


app.get("/api/events", (req, res) => {
  res.json({
    message: "Events endpoint working ✅",
  });
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});