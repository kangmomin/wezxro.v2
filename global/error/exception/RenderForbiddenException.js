const ErrorCode = require("../ErrorCode");
const GenericException = require("./GenericException");

module.exports = class RenderForbiddenException extends GenericException {
    code = ErrorCode.FORBIDDEN
}