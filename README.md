# currency-converter-be

Application to get realtime currency data. 
For now our service only support for `IDR, USD, SGD, PHP` currencies

Before start the application don't forget to create `.env` file with this config
```
POSTGRES_CONNECTION=postgres://postgres:postgres@localhost:5432/currency_converter
XE_ENDPOINT=https://xecdapi.xe.com/v1
XE_USERNAME=USERNAME
XE_PASSWORD=PASSWORD
CURRENCY_CRON="*/15 * * * *"
XE_FROM=IDR
XE_TO=USD,PHP,SGD
PORT=3000
```

Install the dependencies and start dev server
```
$ npm install
$ npm start
```

## Endpoints
Health check route:

Route | Method | Description
----- | ---- | -----------
 / | GET | for check server connection

List of currency routes:

Route | HTTP | Description
----- | ---- | -----------
/currencies/find | GET | find all selected currency by date range
/currencies/calculate | GET | get targeted currency information from your input currency
/currencies/cron/start | GET | runnin the cron to get realtime currency data
/currencies/cron/stop | GET | stop the cron to get realtime currency data