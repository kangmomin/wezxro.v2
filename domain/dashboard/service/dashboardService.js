const ex = module.exports = {}
const Account = require('../../account/entity/account')
const NeedLoginException = require('../../account/exception/NeedLoginException')
const Order = require('../../order/entity/order')

ex.userDetails = async (userId = null) => {
    if (userId === null) throw new NeedLoginException()
    
    const userDetails = await Account.findOne({
        where: { userId },
        attributes: ['money']
    })

    const totalCharge = await Order.sum("totalCharge", {
        where: { userId }
    }).then(val => val?.toLocaleString()) || 0

    const totalOrder = await Order.count({
        where: { userId }
    }).then(val => val?.toLocaleString()) || 0

    return {
        userDetails,
        totalCharge,
        totalOrder
    }
}