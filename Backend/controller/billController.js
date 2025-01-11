// billController.js
const Bill = require("../model/billSchema");

// Create a new bill
const createBill = async (req, res) => {
  const { title, description, billType, amount, dueDate, userId, alarm } =
    req.body;

  try {
    const newBill = new Bill({
      title,
      description,
      billType,
      amount,
      dueDate,
      userId,
      alarm,
    });

    await newBill.save();
    res.status(201).json({
      status: "success",
      message: "Bill created successfully",
      data: newBill, //Only for testing purpose
      billId: newBill._id,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error creating bill",
      error: error.message,
    });
  }
};

// Delete a bill
const deleteBill = async (req, res) => {
  const { billId } = req.body;

  try {
    const deletedBill = await Bill.findByIdAndDelete(billId);
    if (!deletedBill) {
      return res.status(404).json({
        status: "error",
        message: "Bill not found",
      });
    }

    res.json({
      status: "success",
      message: `Bill deleted successfully`,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error deleting bill",
      error: error.message,
    });
  }
};

// Read all bills
const readAllBills = async (req, res) => {
  const { userId } = req.params;
  try {
    const bills = await Bill.find({ userId });
    res.json({
      status: "success",
      message: "Bills retrieved successfully",
      data: bills,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error fetching bills",
      error: error.message,
    });
  }
};

// Update a bill
const updateBill = async (req, res) => {
  const { billId, title, description, billType, amount, dueDate, alarm } =
    req.body;
  try {
    const updatedBill = await Bill.findByIdAndUpdate(
      billId,
      { title, description, billType, amount, dueDate, alarm },
      { new: true }
    );
    if (!updatedBill) {
      return res.status(404).json({
        status: "error",
        message: "Bill not found",
      });
    }

    res.json({
      status: "success",
      message: `Bill updated successfully`,
      data: updatedBill, //only for testing purpose
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error updating bill",
      error: error.message,
    });
  }
};

module.exports = { createBill, deleteBill, readAllBills, updateBill };
