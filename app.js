const express = require("express");
const userRouter = require("./routes/userRoutes");
const categoryRouter = require("./routes/categoryRoutes");
const transactionRouter = require("./routes/transactionRoutes");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const errorHandler = require("./middleware/errorHandlerMiddleware");
require("dotenv").config();

const app = express();

//security
const helmet = require("helmet");
const xss = require("xss-clean");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");

//cors config
const corsOptions = {
  origin: ["http://localhost:5173"],
};
//middleware
app.set("trust proxy", 1);
app.use(helmet());
// app.use(cors());
// app.use(xss());
app.use(mongoSanitize());
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static(path.resolve(__dirname, "./client/dist")));

//routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/transactions", transactionRouter);

//the ftont end
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./client/dist", "index.html"));
});

//errors
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    app.listen(PORT, () => console.log(`Server live, port ${PORT}`));
  } catch (error) {
    console.log(error);
  }
};

start();
