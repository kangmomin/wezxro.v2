const ErrorCode = require("../../../global/error/ErrorCode");
const GenericException = require("../../../global/error/exception/GenericException");

class DepoistNotFoundException extends GenericException {
    code = ErrorCode.DEPOIST_NOT_FOUND_ERROR
}

module.exports = DepoistNotFoundException