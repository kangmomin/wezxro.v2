const ErrorCode = require("../../../global/error/ErrorCode");
const GenericException = require("../../../global/error/exception/GenericException");

module.exports = class UnknownProviderException extends GenericException {
    code = ErrorCode.UNKNOWN_PROVIDER
}