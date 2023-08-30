const express = require('express')
const app = express.Router()

const depoistService = require('../service/depoistService')
const SaveDepositDto = require('../dto/saveDepoistDto')
const ExceptionHandler = require('../../../global/error/ExceptionHandler')



app.post("/add-depoist", async (req, res) => {
    try {
        const userId = req.session.userId
        const saveDepoistDto = SaveDepositDto.fromRequest(req)

        saveDepoistDto.userId = userId

        await depoistService.reqDepoist(saveDepoistDto)

        res.status(201).send("<script>alert('충전 신청이 완료되었습니다.'); location.href='/add-order'</script>")
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

module.exports = app