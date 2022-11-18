//----------Initial Setup----------
const express = require("express");
const dbControllers = require("./dbControllers");
const uploadSLP = require("./uploadSLP");
const router = express.Router();

//----------Routers to Controllers----------
router.get("/getMatches", dbControllers.getMatches, (req, res) =>
  res.status(200).json(res.locals.matchData)
);

router.post("/upload", uploadSLP.add, dbControllers.addMatches, (req, res) =>
  res.status(200).redirect("/")
);

router.put("/update/:id", dbControllers.updateMatches, (req, res) =>
  res.status(200).json({})
);

router.delete("/delete/:id", dbControllers.deleteMatches, (req, res) =>
  res.status(200).json({})
);

//----------Export----------
module.exports = router;
