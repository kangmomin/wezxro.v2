const GenericException = require("../../../global/error/exception/GenericException")

module.exports = class CannotChangeStatusException extends GenericException {
    constructor(comment) {
        super()
        this.code = comment
    }
}