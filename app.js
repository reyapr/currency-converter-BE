require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const sequelize = require('./src/config/postgresql');
const healthCheckRouter = require('./src/routes/index');

const port = process.env.PORT || 3000;

sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });


var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', healthCheckRouter);
app.listen(port, () => {
  console.log(`listening on port: ${port}`)
})

module.exports = app;
