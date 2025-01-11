const express = require("express");
const router = express.Router();
const billController = require("../controller/billController");

router.post("/create", billController.createBill);
router.delete("/delete", billController.deleteBill);
router.get("/:userId", billController.readAllBills);
router.put("/update", billController.updateBill);

module.exports = router;
