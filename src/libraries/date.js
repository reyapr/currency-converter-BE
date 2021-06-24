module.exports = {
  epocToISODate: (epochTime, offset = 7) => {
    var date = new Date(epochTime * 1000);
    var utc = date.getTime() + (date.getTimezoneOffset() * 60000);
    return new Date(utc + (3600000*offset));
  }
}