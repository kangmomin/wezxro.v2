const ExceptionHandler = require("../error/ExceptionHandler")
const UnAuthrizedException = require("../error/exception/UnAuthrizedException")

module.exports = async function isAuthUser (req, res, next) {
    if (!req.session.userId) 
        return ExceptionHandler(res, new UnAuthrizedException())

    next()
}