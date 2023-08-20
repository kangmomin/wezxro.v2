const ErrorCode = require("../../../global/error/ErrorCode");
const GenericException = require("../../../global/error/exception/GenericException");

module.exports = class NeedLoginException extends GenericException {
    constructor() {
        code = ErrorCode.NOT_LOGIN
    }
}