const ErrorCode = require("../../../global/error/ErrorCode");
const GenericException = require("../../../global/error/exception/GenericException");

class OrderMaxException extends GenericException {
    code = ErrorCode.ORDER_MAX_ERROR
}

module.exports = OrderMaxException