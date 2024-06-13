const express = require("express");
const {
  createTransaction,
  getAllTransactions,
  updateTransaction,
  deleteTransaction,
} = require("../controllers/transactionController");

const isAuthenticated = require("../middleware/isAuthenticated");

const router = express.Router();

router.get("/", isAuthenticated, getAllTransactions);
router.post("/", isAuthenticated, createTransaction);
router
  .route("/:id")
  .put(isAuthenticated, updateTransaction)
  .delete(isAuthenticated, deleteTransaction);

module.exports = router;
