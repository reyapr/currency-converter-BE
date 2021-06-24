const { response } = require('express');
const CurrencyRate = require('../model/currency_rate');

const isBaseAmountUnderTargetAmount = (baseAmount, targetAmount) => {
  return baseAmount < targetAmount;
}

const constructCurrencies = currencyRequest => {
  return currencyRequest.to.map(currency => {
    if(isBaseAmountUnderTargetAmount(currencyRequest.amount, currency.mid)) {
      return {
        originCurrency: currencyRequest.from,
        destinationCurrency: currency.quotecurrency,
        rate: currency.mid / currencyRequest.amount
      }
    }
      return {
        originCurrency: currencyRequest.from,
        destinationCurrency: currency.quotecurrency,
        rate: currencyRequest.amount / currency.mid
      }
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
    })
}