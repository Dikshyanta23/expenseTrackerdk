const asyncHandler = require("express-async-handler");
const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//register user
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    throw new Error("Provide all values");
  }
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new Error("User already exists");
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    email,
    username,
    password: hashedPassword,
  });
  res.json({ username: user.username, email: user.email, id: user._id });
});

//login user
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new Error("Provide all fields");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error(`No user found with email ${email}`);
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid login credentials");
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_KEY, {
    expiresIn: "30d",
  });
  res.json({
    message: "Login Successful",
    token,
    id: user._id,
    email: user.email,
    username: user.username,
  });
});

//showProfile
const profile = asyncHandler(async (req, res) => {
  console.log(req.user);
  const user = await User.findOne({ _id: req.user });
  if (!user) {
    throw new Error(`No user with userId ${req.user}`);
  }
  res.json({ username: user.username, email: user.email });
});

//change password
const changePassword = asyncHandler(async (req, res) => {
  const { newPassword } = req.body;
  const user = await User.findOne({ _id: req.user });
  if (!user) {
    throw new Error(`No user with id ${req.user}`);
  }
  //change password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  user.password = hashedPassword;
  await user.save();

  res.json({ message: "Password changed successfully" });
});

//update password
const updateUser = asyncHandler(async (req, res) => {
  const { email, username } = req.body;
  if (!email && !username) {
    throw new Error("Please provide at least one field");
  }

  const updatedUser = await User.findOneAndUpdate(
    { _id: req.user },
    { email, username },
    {
      new: true,
    }
  );
  if (!updateUser) {
    throw new Error(`No user with id ${req.user}`);
  }
  res.json({ message: "Profile successfully updated", updateUser });
});

module.exports = {
  registerUser,
  loginUser,
  profile,
  changePassword,
  updateUser,
};
