const GenericException = require("./exception/GenericException")
const { ValidationError } = require('sequelize')
const RenderAuthorizedException = require("./exception/RenderUnAuthorizedException")
const RenderForbiddenException = require("./exception/RenderForbiddenException")

/**
 * @param {import("express").Response} res 
 * @param {GenericException} error 
 */
module.exports = (res, error) => {
    if (error instanceof RenderAuthorizedException) 
        return res.redirect("/login")

    if (error instanceof RenderForbiddenException) 
        return res.redirect('/')
    
    if (error instanceof GenericException)
        return res.send(JSON.stringify({
            message: error.code,
            status: "error"
        }))

    else if (error instanceof ValidationError){
        return res.send(JSON.stringify({
            message: `데이터가 저장 규칙에 맞지 않습니다. [${error.message}]`
        }))}
    else 
    res.send(JSON.stringify({
        message: "알 수 없는 에러 발생",
        status: "error"
    }))

    console.log(error)
}