const ErrorCode = require("../../../global/error/ErrorCode");
const GenericException = require("../../../global/error/exception/GenericException");

module.exports = class UserNotFoundException extends GenericException {
    code = ErrorCode.USER_NOT_FOUND
}