const ErrorCode = require("../ErrorCode");
const GenericException = require("./GenericException");

module.exports = class NotEngoughArgsException extends GenericException {
    code = ErrorCode.NOT_ENOUGH_ARGS
}