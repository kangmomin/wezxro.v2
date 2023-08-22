const ErrorCode = require("../ErrorCode");
const GenericException = require("./GenericException");

module.exports = class RenderAuthorizedException extends GenericException {
    code = ErrorCode.FORBIDDEN
}