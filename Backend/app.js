const http = require("node:http");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();
const port = process.env.port;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//Import routes
const userRoutes = require("./routes/userRoutes");
const billRoutes = require("./routes/billRoutes");

//Use the routes
app.use("/api/users", userRoutes);
app.use("/api/bills", billRoutes);

//connect to database
const uri = process.env.DB_URL;
const connectToDatabase = async () => {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
};
connectToDatabase();

//connect to server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
