require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const serverless = require("serverless-http");


const router = require('./routes');
const bodyParser = require('body-parser');

// Set the maximum request size limit

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
    limit: '10mb',
  })
);
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use('/uploads', express.static('uploads'));
app.use(
  cors()
);
app.use(`/.api`, router);

mongoose.connect(
 process.env.MONGO_URL
);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function () {
  console.log('Connected successfully');
});

app.listen(port, () => {
  console.log(`Social node js`);
  console.log(`app listening on port ${port} !`);
});
module.exports = app;
module.exports.handler = serverless(app);
