const express = require('express')
const app = express.Router()

const depoistService = require('../service/depoistService')
const SaveDepositDto = require('../dto/saveDepoistDto')



app.post("/add-depoist", async (req, res) => {
    try {
        const userId = req.session.userId
        const saveDepoistDto = SaveDepositDto.fromRequest(req)

        saveDepoistDto.user_id = userId

        await depoistService.reqDepoist(saveDepoistDto)

        res.status(201).send("<script>alert('충전이 완료되었습니다.'); location.href='/add-order'</script>")
    } catch (e) {
        const errInfo = new ErrInfo()

        if (e.toString() == "Error: depoist apply is exist") {
            errInfo.content = "완료되지 않은 주문이 있어 추가 주문을 할 수 없습니다."
        } else {
            console.error(e)
        }

        res.status(errInfo.status).render('error', errInfo)
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