const asyncHandler = require("express-async-handler");
const Category = require("../model/Category");
const Transaction = require("../model/Transaction");

const createCategory = asyncHandler(async (req, res) => {
  const { name, type } = req.body;
  if (!name || !type) {
    throw new Error("Please provide all values");
  }
  const normalizedName = name.toLowerCase();
  const validTypes = ["income", "expense"];
  if (!validTypes.includes(type.toLowerCase())) {
    throw new Error("Invalid category type" + type);
  }

  //check if category already exists
  const categoryExists = await Category.findOne({
    name: normalizedName,
    user: req.user,
  });
  if (categoryExists) {
    throw new Error(`Already have ${normalizedName} in categories`);
  }

  const category = await Category.create({
    name: normalizedName,
    user: req.user,
    type,
  });
  res.status(201).json({ category });
});

const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ user: req.user });
  res.status(200).json(categories);
});

//update a category
const updateCategory = asyncHandler(async (req, res) => {
  const categoryId = req.params.id;
  const { type, name } = req.body;
  const normalizedName = name.toLowerCase();
  const category = await Category.findOne({ _id: categoryId });
  if (!category || category.user.toString() !== req.user.toString()) {
    throw new Error("Category not found or user not authorized");
  }
  const oldName = category.name;
  category.name = name;
  category.type = type;
  const updatedCategory = await category.save();
  //update the affected transactions
  if (oldName !== updateCategory.name) {
    await Transaction.updateMany(
      {
        user: req.user,
        category: oldName,
      },
      { $set: { category: updatedCategory.name } }
    );
  }
  res.status(200).json(updatedCategory);
});

//delete category
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ _id: req.params.id });
  if (category && category.user.toString() === req.user.toString()) {
    const defaultCategory = "Uncategorized";
    await Transaction.updateMany(
      { user: req.user, category: category.name },
      { $set: { category: defaultCategory } }
    );
    await Category.findOneAndDelete({ _id: req.params.id });
    res.status(200).json({ message: "Category removed" });
  } else {
    res
      .status(401)
      .json({ message: "Category not found or user unauthorized" });
  }
});

module.exports = {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
};
