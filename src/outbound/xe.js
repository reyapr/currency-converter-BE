const { DEFAULT_AMOUNT } = require('../constant/xe');
const fetch = require('node-fetch');

module.exports = {
  getConvertedCurrency: (from, to, amount = DEFAULT_AMOUNT) => {
    console.log(`GET ${process.env.XE_ENDPOINT}/convert_from.json`)
    return fetch(`${process.env.XE_ENDPOINT}/convert_from.json/?from=${from}&to=${to}&amount=${amount}`, {
      method: 'get',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${process.env.XE_USERNAME}:${process.env.XE_PASSWORD}`).toString('base64')}`
      }
    })
      .then(response => {
        console.log(`[SUCCESS] success to get currency from xe request=${JSON.stringify({from ,to, amount})}`)
        return response.json();
      })
      .catch(err => {
        console.log(`[FAILED] to get currency from xe request=${JSON.stringify({from ,to, amount})} err=${err}`)
        throw err;
      })
  }
}