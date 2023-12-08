//----------Initial Setup----------
const path = require("path");
const express = require("express");
const redisClient = require("./redisClient");
const router = require("./router");

// const bodyParser = require('body-parser');
const cors = require("cors");

const app = express();
const PORT = 3000;

// //----------Redis----------
redisClient.set("key", "value", (err, reply) => {
  // Handle response
});

//----------Middleware----------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", router);
app.use(cors());

//----------Requested Page Not Found Error----------
app.use((req, res) => res.status(404).send("Page not found"));

//----------Global Error Handler----------
app.use((err, req, res, next) => {
  const defaultErr = {
    log: "Express error handler caught unknown middleware error",
    status: 500,
    message: { err: "An error occurred" },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

//----------Start Server----------
app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}...`);
});

//----------Export----------
module.exports = app;
