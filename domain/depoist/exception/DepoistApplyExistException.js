const ErrorCode = require("../../../global/error/ErrorCode");
const GenericException = require("../../../global/error/exception/GenericException");

module.exports = class DepoistApplyExistException extends GenericException {
    code = ErrorCode.DEPOIST_APPLY_EXIST
}