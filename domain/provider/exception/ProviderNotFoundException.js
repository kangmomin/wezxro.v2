const ErrorCode = require("../../../global/error/ErrorCode");
const GenericException = require("../../../global/error/exception/GenericException");

module.exports = class ProviderNotFoundException extends GenericException {
    code = ErrorCode.PROVIDER_NOT_FOUND
}