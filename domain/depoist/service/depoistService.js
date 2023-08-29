const ex = module.exports = {}
const axios = require('axios')
const DepoistRenderDto = require('../dto/depoistRenderDto')
const SaveDepositDto = require('../dto/saveDepoistDto')
const depoistRepository = require('../entity/depoist')
const status = require('../entity/constant/status')
const DepoistApplyExistException = require('../exception/DepoistApplyExistException')
const formatDateTime = require('../../../global/util/formatDateTime')
const Account = require('../../account/entity/account')
const getSequelize = require('../../../global/config/getSequelize')

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
        e.created = formatDateTime(e.createdAt)
        return e
    })

    return depoist
}

/**
* 입금 신청 
* @param {SaveDepositDto} saveDepoistDto 
*/
ex.reqDepoist = async (saveDepoistDto) => {
    if (await depoistRepository.count({
        where: {
            userId: saveDepoistDto.userId,
            status: status.pending
        }
    }) > 0) throw new DepoistApplyExistException()

    await depoistRepository.create(saveDepoistDto)
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

        const depoist = await depoistRepository.findOne({
            where: {
                status: status.pending,
                rname: pname,
                pay: pmoney,
            },
            attributes: ['userId']
        })

        Account.update({
            money: getSequelize().literal(`money + ${pmoney}`)
        }, {
            where: {
                userId: depoist.userId
            }
        })
        
        depoistRepository.update({
            status: status.done
        }, {
            where: {
                status: status.pending,
                rname: pname,
                pay: pmoney,
            }
        })
        
    }
    resultArray.RCODE = rdata.RCODE;
    return resultArray
}