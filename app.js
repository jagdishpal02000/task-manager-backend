const express = require("express");
const cors = require("cors");
require("dotenv").config();

const globalErrorHandler = require("./middleware/globalErrorHandler.js");

global.asyncWrapper = require("./middleware/asyncWrapper.js");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.get("/", (req, res) => {
  res.send("Welcome To task managment APIs");
});

app.use("/auth", require('./routes/auth.js'));
app.use("/task", require('./routes/task.js'));

// Global Error Handler
app.use(globalErrorHandler);

module.exports = app;
