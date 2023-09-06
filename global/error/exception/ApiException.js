const ErrorCode = require("../ErrorCode");
const GenericException = require("./GenericException");

module.exports = class ApiException extends GenericException {

    code = ErrorCode.DEFAULT_API_ERROR
    constructor(comment = null) {
        super()
        if (comment) this.code = comment
    }
}