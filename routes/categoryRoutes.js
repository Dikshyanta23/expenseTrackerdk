const express = require("express");
const {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

const isAuthenticated = require("../middleware/isAuthenticated");

const router = express.Router();

router.post("/", isAuthenticated, createCategory);
router.get("/", isAuthenticated, getAllCategories);
router
  .route("/:id")
  .put(isAuthenticated, updateCategory)
  .delete(isAuthenticated, deleteCategory);

module.exports = router;
