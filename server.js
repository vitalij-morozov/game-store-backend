require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const router = require('./routers/MainRouter');

const app = express();

const port = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_DB_KEY)
  .then(() => {
    console.log('mongoose connection is established');
  })
  .catch((error) => {
    console.warn('mongoose connection error: ' + error);
  });

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/', router);

app.listen(port, () => {
  console.log('server is running on port ' + port);
});

app.use((req, res) => {
  res.status(404).json({ message: 'Not Found 404' });
});
