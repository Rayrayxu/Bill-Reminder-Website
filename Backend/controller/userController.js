// userController.js
const User = require("../model/userSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const jwt_secret = process.env.JWT_SECRET;
const jwt_secret_expire = process.env.JWT_SECRET_EXPIRE;

// Create a new user account
const createAccount = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: "error",
        message: "Email already exists",
      });
    }

    // Create new user
    const newUser = new User({
      email,
      password,
    });
    await newUser.save();
    res.status(201).json({
      status: "success",
      message: "Account created successfully",
      userId: newUser._id,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error creating account",
      error: error.message,
    });
  }
};

// Delete a user account
const deleteAccount = async (req, res) => {
  const { userId } = req.params;
  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }
    res.json({
      status: "success",
      message: "Account deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error deleting account",
      error: error.message,
    });
  }
};

// Login user account
const loginAccount = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      status: "error",
      message: "Email and password are required",
    });
  }

  try {
    //find the user collection through email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "Invalid email or password",
      });
    }

    //Comfirm user hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ status: "error", message: "password incorrect!" });
    }

    //Generate JWT token for user
    const token = jwt.sign({ userId: user._id }, jwt_secret, {
      expiresIn: jwt_secret_expire,
    });

    //return
    res.json({
      status: "success",
      message: "User logged in successfully",
      userId: user._id,
      token: token,
      user: user, //Only for testing purpose
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error logging in",
      error: error.message,
    });
  }
};

// Logout user account
const logoutAccount = (req, res) => {
  res.json({
    status: "success",
    message: "User logged out successfully",
  });
};

// Update user password
const updateAccountPassword = async (req, res) => {
  const { userId, oldPassword, newPassword } = req.body;
  console.log(req.body);
  try {
    if (!newPassword || !oldPassword) {
      return res.status(400).json({
        status: "error",
        message: "Old password or New password is required",
      });
    }
    const user = await User.findById(userId);
    const isMatch = bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ status: "error", message: "Old password incorrect!" });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      status: "success",
      message: `Password updated successfully`,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error updating password",
      error: error.message,
    });
  }
};

module.exports = {
  createAccount,
  deleteAccount,
  loginAccount,
  logoutAccount,
  updateAccountPassword,
};
