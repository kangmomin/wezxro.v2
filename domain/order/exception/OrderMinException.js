const ErrorCode = require("../../../global/error/ErrorCode");
const GenericException = require("../../../global/error/exception/GenericException");

class OrderMinException extends GenericException {
    code = ErrorCode.ORDER_MIN_ERROR
}

module.exports = OrderMinException