const ErrorCode = require("../../../global/error/ErrorCode");
const GenericException = require("../../../global/error/exception/GenericException");

module.exports = class RateToolLowException extends GenericException {
    code = ErrorCode.RATE_TOO_LOW
}