const cron = require('node-cron');
const xeOutbound = require('../outbound/xe');
const currencyService = require('../service/currency');


const task = cron.schedule(process.env.CURRENCY_CRON, () => {
  console.log(`running the task to get currency rate, format_time:${process.env.CURRENCY_CRON}`)

  xeOutbound.getConvertedCurrency(process.env.XE_FROM, process.env.XE_TO)
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
  getCurrencies: (req, res) => {
    currencyService.getCurrenciesByDate(req.query)
      .then(response => {
        console.log(`[SUCCES] to get currencies query=${JSON.stringify(req.query)} response=${JSON.stringify(response)}`)
        res.status(200)
          .json({
            message: 'success to get currencies',
            data: response.map(currenciesResponse)
          })
      })
      .catch(err => {
        console.log(`failed to get currencies query=${JSON.stringify(req.query)} err=${err}`)
        res.status(400)
          .json({
            message: 'failed to get currencies',
          })
      })
  }
}