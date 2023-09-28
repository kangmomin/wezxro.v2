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
            message: !req.body.id ? 
                "도매처 추가 성공" : 
                "도매처 업데이트 성공",
            status: "success"
        }))
    } catch(e) {
        ExceptionHandler(res, e)
    }
})

app.post('/admin/provider/delete/:providerId', isAdmin, async (req, res) => {
    try {
        await providerService.providerDelete(req.params.providerId)
        res.send(JSON.stringify({
            message: "도매처를 삭제하였습니다",
            status: "success"
        }))
    } catch(e) {
        ExceptionHandler(res, e)
    }
})

app.post("/admin/provider/change_status/:providerId", isAdmin, async (req, res) => {
    try {
        const { status } = req.body
        
        await providerService.updateStatus(req.params.providerId, status)
        
        res.send(JSON.stringify({
            message: "도매처의 status를 업데이트 했습니다.",
            status: "success"
        }))
    } catch(e) {
        ExceptionHandler(res, e)
    }
})

app.post("/admin/provider/balance/:providerId", isAdmin, async (req, res) => {
    try {        
        await providerService.updateBalance(req.params.providerId)
        
        res.send(JSON.stringify({
            message: "도매처의 보유액을 업데이트 했습니다.",
            status: "success"
        }))
    } catch(e) {
        ExceptionHandler(res, e)
    }
})

app.post("/admin/provider/delete/:providerId", async (req, res) => {
    try {
        await providerService.deleteProvider(req.params.providerId)

        res.send(JSON.stringify({
            message: "도매처를 삭제하였습니다.",
            status: "success"
        }))
    } catch(e) {
        ExceptionHandler(res, e)
    }
})

module.exports = app