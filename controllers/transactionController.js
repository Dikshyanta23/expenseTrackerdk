const asyncHandler = require("express-async-handler");
const Transaction = require("../model/Transaction");

//create a transaction
const createTransaction = asyncHandler(async (req, res) => {
  const { type, category, amount, date, description } = req.body;
  if (!amount || !type || !date) {
    throw new Error("Type, amount and date are required");
  }
  //create
  const transaction = await Transaction.create({
    user: req.user,
    type,
    category,
    amount,
    date,
    description,
  });
  res.status(201).json(transaction);
});

//get All transactions
const getAllTransactions = asyncHandler(async (req, res) => {
  const { startDate, endDate, type, category } = req.query;
  let filters = {
    user: req.user,
  };
  if (startDate) {
    filters.date = { ...filters.date, $gte: new Date(startDate) };
  }
  if (endDate) {
    filters.date = { ...filters.date, $lte: new Date(endDate) };
  }
  if (type) {
    filters.type = type;
  }
  if (category) {
    if (category === "All") {
    } else if (category === "Uncategorized") {
      filters.category = "Uncategorized";
    } else {
      filters.category = category;
    }
  }

  const transactions = await Transaction.find(filters).sort({ date: -1 });
  res.status(200).json(transactions);
});

//update a transaction

const updateTransaction = asyncHandler(async (req, res) => {
  //find the transaction
  const transaction = await Transaction.findOne({ _id: req.params.id });
  if (transaction && transaction.user.toString() === req.user.toString()) {
    transaction.type = req.body.type || transaction.type;
    transaction.category = req.body.category || transaction.category;
    transaction.amount = req.body.amount || transaction.amount;
    transaction.date = req.body.date || transaction.date;
    transaction.description = req.body.description || transaction.description;
    const updatedTransaction = await transaction.save();
    res.status(200).json(updatedTransaction);
  }
});

//delete transaction
const deleteTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findOne({ _id: req.params.id });
  if (transaction && transaction.user.toString() === req.user.toString()) {
    await Transaction.findOneAndDelete({ _id: req.params.id });
    res.status(200).json({ message: "Transaction removed" });
  }
});

module.exports = {
  createTransaction,
  getAllTransactions,
  updateTransaction,
  deleteTransaction,
};
