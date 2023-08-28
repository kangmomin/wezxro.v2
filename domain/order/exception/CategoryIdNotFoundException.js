const ErrorCode = require("../../../global/error/ErrorCode");
const GenericException = require("../../../global/error/exception/GenericException");

module.exports = class CategoryIdNotFoundError extends GenericException {
    code = ErrorCode.CATEGORY_ID_NOT_FOUND
}