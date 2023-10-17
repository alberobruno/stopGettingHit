//----------Initial Setup----------
const path = require("path");
const express = require("express");
const redis = require("redis");
const router = require("./router");

// const bodyParser = require('body-parser');
const cors = require("cors");

const app = express();
const PORT = 3000;

// //----------Redis----------
const client = redis.createClient({
  password: "slab-coping-flying",
  socket: {
    host: "redis-12503.c8.us-east-1-2.ec2.cloud.redislabs.com",
    port: 12503,
  },
});
client.on("connect", () => {
  console.log("Connected to Redis");
});

client.on("error", (err) => {
  console.log("Redis error: ", err);
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
