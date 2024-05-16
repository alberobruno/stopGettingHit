//----------Initial Setup----------
import express from 'express';
import dbControllers from './dbControllers';
import uploadSLP from './uploadSLP';
const router = express.Router();

//----------Routers to Controllers----------
router.get('/getMatches', dbControllers.getMatches, (req, res) =>
  res.status(200).json(res.locals.matchData)
);

router.post('/upload', uploadSLP.add, dbControllers.addMatches, (req, res) =>
  res.status(200).redirect('/')
);

router.put('/update/:id', dbControllers.updateMatches, (req, res) =>
  res.status(200).json({})
);

router.delete('/delete/:id', dbControllers.deleteMatches, (req, res) =>
  res.status(200).json({})
);

// router.delete('/test-redis', dbControllers.redis, (req, res) =>
//   res.status(200).json({})
// );

//----------Export----------
export default router;
