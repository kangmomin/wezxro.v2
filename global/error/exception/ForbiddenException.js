const ErrorCode = require("../ErrorCode");
const GenericException = require("./GenericException");

module.exports = class ForbiddenException extends GenericException {
    code = ErrorCode.FORBIDDEN
}