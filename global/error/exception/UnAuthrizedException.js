const ErrorCode = require("../ErrorCode");
const GenericException = require("./GenericException");

module.exports = class UnAuthrizedException extends GenericException {
    code = ErrorCode.UNAUTHRIZED
}