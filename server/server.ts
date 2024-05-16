//----------Initial Setup----------
// import path from 'path';
import express, { ErrorRequestHandler } from 'express';
import redisClient from './redisClient';
import router from './router';

// const bodyParser = require('body-parser');
import cors from 'cors';

const app = express();
const PORT = 3000;

// //----------Redis----------
async function initializeRedis() {
  try {
    const reply = await redisClient.set('key', 'value');
    console.log('Redis set response:', reply);
  } catch (err) {
    console.error('Redis Initialization error:', err);
  }
}
initializeRedis();

//----------Middleware----------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', router);
app.use(cors());

//----------Requested Page Not Found Error----------
app.use((req, res) => res.status(404).send('Page not found'));

//----------Global Error Handler----------
const errorHandler: ErrorRequestHandler = (err, req, res) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.error('Global Error Handler: ', errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
};
app.use(errorHandler);

//----------Start Server----------
app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}...`);
});

//----------Export----------
export default app;
