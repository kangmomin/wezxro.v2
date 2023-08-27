const express = require('express')
const app = express.Router()

const providerService = require('../service/providerService') 
const SaveProviderDto = require('../dto/SaveProviderDto')
const ExceptionHandler = require('../../../global/error/ExceptionHandler')
const isAdmin = require('../../../global/config/filter/isAdmin')

app.post("/admin/provider/store", isAdmin, async (req, res) => {
    try {
        await providerService.saveProvider(
            new SaveProviderDto(req.body), 
            req.session.userId)
        res.send(JSON.stringify({
            message: "도매처 추가 성공",
            status: "success"
        }))
    } catch(e) {
        ExceptionHandler(res, e)
    }
})

module.exports = app