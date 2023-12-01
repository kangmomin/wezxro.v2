const ex = module.exports = {}
const axios = require('axios')
const crypto = require('crypto')
const DepoistRenderDto = require('../dto/depoistRenderDto')
const SaveDepositDto = require('../dto/saveDepoistDto')
const depoistRepository = require('../entity/depoist')
const status = require('../entity/constant/status')
const DepoistApplyExistException = require('../exception/DepoistApplyExistException')
const formatDateTime = require('../../../global/util/formatDateTime')
const Account = require('../../account/entity/account')
const getSequelize = require('../../../global/config/getSequelize')
const UserNotFoundException = require('../../account/exception/UserNotFoundException')
const NotEngoughArgsException = require('../../../global/error/exception/NotEnoughArgsException')
const DepoistNotFoundException = require('../exception/DepoistNotFoundException')

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
 * 
 * @param {UpdateDepositDto} updateDepostDto 
*/
ex.updateDepoist = async (updateDepostDto) => {
    await depoistRepository.update(updateDepostDto, {
        where: {
            depoistId: updateDepostDto.ids
        }
    })
}

ex.addFund = async (id, amount, secret_key, type, userId) => {
    const admin = await Account.findOne({
        where: { userId }
    })

    const result = crypto.createHash('sha512').update(secret_key + admin.random).digest('base64')

    if (admin.password != result) throw new UserNotFoundException()
    
    const depoistDto = new SaveDepositDto.Builder()
        .withUserId(Number(id))
        .withPay(Number(amount))
        .withRname("관리자")
        .withType(type)
        .build()

    depoistDto.status = status.done
    
    await depoistRepository.create(depoistDto)
    await Account.update({
        money: getSequelize().literal(`money + ${amount}`)
    }, {
        where: {
            userId: id
        }
    })
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

        if (depoist && depoist.userId !== undefined && depoist.userId !== null) {
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
    }
    resultArray.RCODE = rdata.RCODE;
    return resultArray
}

ex.findForUpdate = async (depoistId = null) => {
    if (!depoistId) throw new NotEngoughArgsException()

    const depoist = await depoistRepository.findByPk(depoistId, {
        attributes: ["note", "pay", "depoistId", "status"]
    })

    if (!depoist) throw new DepoistNotFoundException()

    return depoist
}

ex.allDepoist = async () => {
    let depoists = await depoistRepository.findAll()
    const ids = depoists.map(d => d.userId)

    const user = await Account.findAll({
        where: {
            userId: ids
        }
    })

    depoists = depoists.map((d, idx) => {
        if (user[idx] === undefined) {
            console.log(user[idx])
            console.log(`idx: ${idx}`)
            console.log(`depoist: ${depoists.length}`)
        }
        if (d.userId == user[idx].userId) d.email = user[idx].email
        else d.email = "deleted user"
        
        d.created = formatDateTime(d.createdAt)

        return d
    })

    return depoists
}

ex.delete = async (depoistId = null) => {
    if (!depoistId) throw new NotEngoughArgsException()

    await depoistRepository.destroy({
        where: { depoistId }
    })
}