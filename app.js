require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const sequelize = require('./src/config/postgresql');
const healthCheckRouter = require('./src/routes/index');
const currencyRouter = require('./src/routes/currency');
const { exceptionHandler } = require('./src/middleware/index')
const cors = require('cors');
const corsOptions = {
  origin: process.env.DNS,
  optionsSuccessStatus: 200
}


const port = process.env.PORT || 3000;

sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });


var app = express();

app.use(cors(corsOptions));
app.options('*', cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', healthCheckRouter);
app.use('/currencies', currencyRouter)
app.use(exceptionHandler)
app.listen(port, () => {
  console.log(`listening on port: ${port}`)
})

module.exports = app;
