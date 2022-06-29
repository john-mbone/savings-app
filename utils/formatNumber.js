const { replace } = require('lodash');
const numeral = require('numeral')

// ----------------------------------------------------------------------

exports.fCurrency = (number) => {
  return numeral(number).format(Number.isInteger(number) ? '0,0' : '0,0.00');
}

exports.fPercent = (number) => {
  return numeral(number / 100).format('0.0%');
}

exports.fNumber = (number) => {
  return numeral(number).format();
}

exports.fShortenNumber = (number) => {
  return replace(numeral(number).format('0.00a'), '.00', '');
}

exports.fData = (number) => {
  return numeral(number).format('0.0 b');
}
