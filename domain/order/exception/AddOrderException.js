const ErrorCode = require("../../../global/error/ErrorCode");
const GenericException = require("../../../global/error/exception/GenericException");

module.exports = class AddOrderException extends GenericException {
    constructor(error = ErrorCode.ADD_ORDER_ERROR) {
        super()

        this.code = error
    }
    
}