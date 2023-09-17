const express = require('express')
const app = express.Router()

const depoistService = require('../service/depoistService')
const SaveDepositDto = require('../dto/saveDepoistDto')
const ExceptionHandler = require('../../../global/error/ExceptionHandler')
const isAdmin = require('../../../global/config/filter/isAdmin')
const UpdateDepositDto = require('../dto/UpdateDepoistDto,')



app.post("/add-depoist", async (req, res) => {
    try {
        const userId = req.session.userId
        const saveDepoistDto = SaveDepositDto.fromRequest(req)

        saveDepoistDto.userId = userId

        await depoistService.reqDepoist(saveDepoistDto)

        res.redirect('transactions?result=success')
    } catch (e) {
        ExceptionHandler(res, e)
    }
})

app.post("/depoist", async (req, res) => {
    const RTP_KEY = process.env.RTP_KEY


    let RTP_URL = 'https://rtpay.net/CheckPay/checkpay.php';

    if (parseInt(req.body.ugrd) < 20) {
        RTP_URL = 'https://rtpay.net/CheckPay/test_checkpay.php';
    } else {
        RTP_URL = 'https://rtpay.net/CheckPay/checkpay.php';
    }

    if (req.body.regPkey == RTP_KEY) {
        const resultArray = await depoistService.checkCharge(RTP_URL, req.body)
        res.send(resultArray)
        return
    }
    
    res.send(JSON.stringify({ 'RCODE': '400', 'PCHK': '' }));
})

app.post("/admin/users/add_funds_process/", isAdmin, async (req, res) => {
    try {
        const { ids, payment_method, amount, secret_key } = req.body
        
        await depoistService.addFund(ids, amount, secret_key, payment_method, req.session.userId)

        res.send(JSON.stringify({
            message: "보유액을 추가했습니다.",
            status: "success"
        }))
    } catch(e) {
        ExceptionHandler(res, e)
    }
})

app.post("/admin/transactions/store", isAdmin, async (req, res) => {
    try {
        const updateDepoistDto = new UpdateDepositDto(req.body)

        await depoistService.updateDepoist(updateDepoistDto)
        
        res.send(JSON.stringify({
            message: "주문 내역을 수정하였습니다.",
            status: "success"
        }))
    } catch(e) {
        ExceptionHandler(res, e)
    }
})

app.post("/admin/transactions/delete/:depoistId", async (req, res) => {
    try {
        await depoistService.delete(req.params.depoistId)
        
        res.send(JSON.stringify({
            message: "충전 내역을 삭제하였습니다.",
            status: "success"
        }))
    } catch(e) {
        ExceptionHandler(res, e)
    }
})

module.exports = app