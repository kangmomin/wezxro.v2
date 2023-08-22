const ExceptionHandler = require("../../error/ExceptionHandler")
const ForbiddenException = require("../../error/exception/ForbiddenException")
const UnAuthrizedException = require("../../error/exception/UnAuthrizedException")

module.exports = async function isAuthUser (req, res, next) {
    if (!req.session.userId)
        return ExceptionHandler(res, new UnAuthrizedException())
    else if (!req.session.isAdmin) 
        return ExceptionHandler(res, new ForbiddenException())

    next()
}