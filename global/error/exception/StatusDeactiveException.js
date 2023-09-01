const ErrorCode = require("../ErrorCode");
const GenericException = require("./GenericException");

module.exports = class StatusDeactiveException extends GenericException {
    code = ErrorCode.STATUS_DEACTIVE
}