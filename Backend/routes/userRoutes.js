const express = require("express");
const router = express.Router();
const {
  createAccount,
  deleteAccount,
  loginAccount,
  logoutAccount,
  updateAccountPassword,
} = require("../controller/userController");
const authenticateToken = require("../middleware/authMiddleware");

router.post("/create", createAccount);
router.delete("/delete/:userId", authenticateToken, deleteAccount);
router.post("/login", loginAccount);
router.post("/logout", authenticateToken, logoutAccount);
router.put("/update", authenticateToken, updateAccountPassword);

module.exports = router;
