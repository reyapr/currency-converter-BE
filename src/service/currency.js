const CurrencyRate = require('../model/currency_rate');
const { epocToISODate } = require('../libraries/date');
const { Op } = require('sequelize');
const xeOutbound = require('../outbound/xe');

const isBaseAmountUnderTargetAmount = (baseAmount, targetAmount) => {
  return baseAmount < targetAmount;
}

const getRate = (amount, targetAmount) => {
  if(isBaseAmountUnderTargetAmount(amount, targetAmount)) {
    return amount / targetAmount
  }
  return targetAmount / amount 
}

getCurrenciesBetweenTarget = (currencies, currency) => {
  return currencies
    .filter(anotherTargetCurrency => anotherTargetCurrency.quotecurrency !== currency.quotecurrency)
    .map(anotherTargetCurrency => ({
      originCurrency: currency.quotecurrency,
      destinationCurrency: anotherTargetCurrency.quotecurrency,
      rate: getRate(currency.mid, anotherTargetCurrency.mid)
    }))
}

const constructCurrencies = currencyRequest => {
  return currencyRequest.to.flatMap(currency => {
    return [
      {
        originCurrency: currencyRequest.from,
        destinationCurrency: currency.quotecurrency,
        rate: getRate(currencyRequest.amount, currency.mid)
      },
      {
        originCurrency: currency.quotecurrency,
        destinationCurrency: currencyRequest.from,
        rate: getRate(currencyRequest.amount, currency.mid)
      },
      ...getCurrenciesBetweenTarget(currencyRequest.to, currency)
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
  },
  getCurrenciesFromXe: currencyRequest => {
    return xeOutbound.getConvertedCurrency(currencyRequest.from, currencyRequest.to, currencyRequest.amount)
  },
  getCalculatedCurrencies: function(currencyRequest) {
    return this.getCurrenciesFromXe(currencyRequest)
      .then(response => ({
        [response.from]: {
          currency: response.from,
          amount: response.amount
        },
        [response.to[0].quotecurrency]: {
          currency: response.to[0].quotecurrency,
          amount: response.to[0].mid
        },
        rate: getRate(response.amount, response.to[0].mid),
        fetchedTime: response.timestamp
      }))
  }
}