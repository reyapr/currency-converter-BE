const CurrencyRate = require('../model/currency_rate');
const { epocToISODate } = require('../libraries/date');
const { Op } = require('sequelize');

const isBaseAmountUnderTargetAmount = (baseAmount, targetAmount) => {
  return baseAmount < targetAmount;
}

const constructCurrencies = currencyRequest => {
  return currencyRequest.to.flatMap(currency => {
    if(isBaseAmountUnderTargetAmount(currencyRequest.amount, currency.mid)) {
      return [
        {
          originCurrency: currencyRequest.from,
          destinationCurrency: currency.quotecurrency,
          rate: currency.mid / currencyRequest.amount
        },
        {
          originCurrency: currency.quotecurrency,
          destinationCurrency: currencyRequest.from,
          rate: currency.mid / currencyRequest.amount
        }
      ]
    }
      return [
        {
          originCurrency: currencyRequest.from,
          destinationCurrency: currency.quotecurrency,
          rate: currencyRequest.amount / currency.mid
        },
        {
          originCurrency: currency.quotecurrency,
          destinationCurrency: currencyRequest.from,
          rate: currencyRequest.amount / currency.mid
        }
      ]
  })
}

module.exports = {
  createCurrency: currencyRequest => CurrencyRate.bulkCreate(constructCurrencies(currencyRequest))
    .then(response => {
      console.log(`[SUCCESS] success to save currency rate request=${JSON.stringify(currencyRequest)}`)
      return response;
    })
    .catch(err => {
      console.log(`[FAILED] failed to save currency rate request=${JSON.stringify(currencyRequest)} err=${err}`)
      throw err;
    }),
  getCurrenciesByDate: currencyRequest => {
    return CurrencyRate.findAll({
      where: {
        originCurrency: currencyRequest.origin,
        destinationCurrency: currencyRequest.destination,
        createdAt: {
          [Op.between]: [epocToISODate(currencyRequest.startDate), epocToISODate(currencyRequest.endDate)]
        }
      }
    })
  }
}