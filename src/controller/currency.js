const cron = require('node-cron');
const { BusinessLogicException } = require('../libraries/exception');
const currencyService = require('../service/currency');


const task = cron.schedule(process.env.CURRENCY_CRON || "*/15 * * * *", () => {
  console.log(`running the task to get currency rate, format_time:${process.env.CURRENCY_CRON}`)

  currencyService.getCurrenciesFromXe({from:process.env.XE_FROM, to: process.env.XE_TO})
    .then(response => currencyService.createCurrency(response))
})

const currenciesResponse = ({originCurrency, destinationCurrency, rate, createdAt }) => ({
  originCurrency,
  destinationCurrency,
  rate,
  createdAt
})

module.exports = {
  startCron: (req, res) => {
    task.start()

    res.status(200)
      .json({
        message: 'success to run the task'
      })
  },
  stopCron: (req, res) => {
    task.stop()
    res.status(200)
      .json({
        message: 'success to stop the task'
      })
  },
  getCurrencies: (req, res, next) => {
    currencyService.getCurrenciesByDate(req.query)
      .then(response => {
        if(response.length === 0) {
          throw new BusinessLogicException({
            status: 400,
            message: "Data Not Exist"
          })
        }
        
        console.log(`[SUCCES] to get currencies request=${JSON.stringify(req.query)} response=${JSON.stringify(response)}`)
        res.status(200)
          .json({
            message: 'success to get currencies',
            data: response.map(currenciesResponse)
          })
      })
      .catch(err => next(err))
  },
  getCalculatedCurrencies: (req, res, next) => {
    currencyService.getCalculatedCurrencies(req.query)
      .then(response => {
        console.log(`[SUCCES] to get calculated currencies request=${JSON.stringify(req.query)} response=${JSON.stringify(response)}`)
        res.status(200)
          .json({
            message: 'success to get calculated currencies',
            data: response
          })
      })
      .catch(err => next(err))
  }
}