const ex = module.exports = {}
const axios = require('axios')
const DepoistRenderDto = require('../dto/depoistRenderDto')
const SaveDepositDto = require('../dto/saveDepoistDto')
const depoistRepository = require('../entity/depoist')

/**
 * 
 * @param {Number} user_id 
 * @returns {DepoistRenderDto[]}
 */
ex.depoistRender = async (user_id) => {
    const depoist = await depoistRepository.findAll({
        where: {
            userId: user_id
        }
    })

    depoist.map(e => {
        e.created = formatDateTime(e.created)
        return e
    })

    return depoist
}

/**
* 입금 신청 
* @param {SaveDepositDto} saveDepoistDto 
*/
ex.reqDepoist = async (saveDepoistDto) => {
    const conn = await new DB().getConn()

    try {
        if (!await depoistRepository.isWaitDepoistExist(conn, saveDepoistDto.user_id))
            throw new Error("depoist apply is exist")

        await depoistRepository.saveDepoist(conn, saveDepoistDto)
        await conn.commit()
    } catch (e) {
        await conn.rollback()
        throw e
    } finally {
        conn.release()
    }
}

/**
 * 입금 확인 req 앱에서 알아서 요청이 들어옴
 */
ex.checkCharge = async (RTP_URL, body) => {
    let resultArray = { 'RCODE': '', 'PCHK': '' };

    const res = await axios.post(RTP_URL, body, {
        headers: {
            'Content-type': 'application/x-www-form-urlencoded'
        }
    })

    var rdata = res.data;
    if (rdata.RCODE == '200') {
        var pbank = rdata.RBANK;	//은행명
        var pname = rdata.RNAME;	//입금자명
        var pmoney = rdata.RPAY;	//입금금액
        var tall = rdata.RTEXT;	//전송 데이터 전문

        const conn = await new DB().getConn()

        try {
            await depoistRepository.updateMoney(conn, pname, pmoney)
            await conn.commit()
        } catch (e) {
            await conn.rollback()
            // 정보가 없음에도 입금된 케이스 처리 로직
        } finally {
            conn.release()
        }
    }
    resultArray.RCODE = rdata.RCODE;
    return resultArray
}