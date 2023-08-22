const ExceptionHandler = require("../../error/ExceptionHandler")
const RenderForbiddenException = require("../../error/exception/RenderForbiddenException")
const RenderAuthorizedException = require("../../error/exception/RenderUnAuthorizedException")

module.exports = async function isAuthUser (req, res, next) {
    if (!req.session.userId)
        return ExceptionHandler(res, new RenderAuthorizedException())
    else if (!req.session.isAdmin) 
        return ExceptionHandler(res, new RenderForbiddenException())

    next()
}