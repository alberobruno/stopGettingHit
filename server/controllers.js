//----------Initial Setup----------
const db = require('./models');
const controller = {};

//----------Display Matches----------
controller.getMatches = async (req, res, next) => {
  try {
    const query = 'SELECT * FROM matches';
    const result = await db.query(query);
    console.log(result);
    res.locals.getMatches = result.rows[0];
    next();
  } catch (err) {
    next({
      log: `controller.getMatches: ${err}`,
      status: 400,
      message: err,
    });
  }
};

//----------Export----------
module.exports = controller;
