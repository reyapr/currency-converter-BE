const { BusinessLogicException } = require('../libraries/exception');

module.exports = {
  exceptionHandler: (err, req, res, next) => {
    console.log(`[Error] message: ${err.message}`, err.stack);
  
   if (err instanceof BusinessLogicException) {
      res.status(err.status).json({
        message: err.message,
      });
    } else {
      res.status(500).json({
        message: 'Runtime Error'
      })
    }
  
  }
}