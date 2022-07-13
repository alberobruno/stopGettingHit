//----------Initial Setup----------
const express = require('express');
const controllers = require('./controllers');
const router = express.Router();

//----------Routers to Controllers----------
router.get('/get', controllers.getMatches, (req, res) =>
  res.status(200).json(res.locals.getMatches)
);

// router.post('/upload', controllers.addMatches, (req, res) =>
//   res.status(200).json({})
// );

// router.put('/update', controllers.updateMatches, (req, res) =>
//   res.status(200).json({})
// );

// router.delete('/delete', controllers.deleteMatches, (req, res) =>
//   res.status(200).json({})
// );

//----------Export----------
module.exports = router;
