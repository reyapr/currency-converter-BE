const { DataTypes } = require('sequelize')
const sequelize = require('../config/postgresql');
const { CURRENCY_RATE } = require('../constant/model');
const Currency = require('./currency');


const CurrencyRate = sequelize.define(CURRENCY_RATE, {
  originCurrency: {
    field: 'origin_currency',
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notNull: { msg: "origin currency is required" }
    }
  },
  destinationCurrency: {
    field: 'destination_currency',
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notNull: { msg: "destination currency is required" }
    }
  },
  rate: DataTypes.NUMBER
})

CurrencyRate.sync();

module.exports = CurrencyRate;