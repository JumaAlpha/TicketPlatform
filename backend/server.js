const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const db = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
    res.send("Welcome to the Online Ticketing System!");
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
