const GenericException = require("./exception/GenericException")

/**
 * @param {import("express").Response} res 
 * @param {GenericException} error 
 */
module.exports = (res, error) => {
    if (error instanceof GenericException)
        return res.send(JSON.stringify({
            message: error.code,
            status: "error"
        }))

    res.send(JSON.stringify({
        message: "알 수 없는 에러 발생",
        status: "error"
    }))

    console.log(error)
}