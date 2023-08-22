const ErrorCode = require("../ErrorCode");
const GenericException = require("./GenericException");

module.exports = class UnAuthorizedException extends GenericException {
    code = ErrorCode.UNAUTHRIZED
}