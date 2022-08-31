//----------Initial Setup----------
const express = require('express');
const controllers = require('./controllers');
const router = express.Router();

//----------Routers to Controllers----------
router.get('/getMatches', controllers.getMatches, (req, res) =>
  res.status(200).json(res.locals.matchData)
);

router.post('/upload', controllers.addMatches, (req, res) =>
  res.status(200).json({})
);

router.put('/update/:id', controllers.updateMatches, (req, res) =>
  res.status(200).json({})
);

router.delete('/delete/:id', controllers.deleteMatches, (req, res) =>
  res.status(200).json({})
);

//----------Export----------
module.exports = router;
