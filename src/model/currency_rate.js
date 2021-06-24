const { DataTypes } = require('sequelize')
const sequelize = require('../config/postgresql');
const { CURRENCY_RATE } = require('../constant/model');


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
  rate: DataTypes.DECIMAL
})

CurrencyRate.sync();

module.exports = CurrencyRate;