const ex = module.exports = {}
const { Op, literal } = require('sequelize')
const Account = require('../../account/entity/account')
const NeedLoginException = require('../../account/exception/NeedLoginException')
const Order = require('../../order/entity/order')
const status = require('../../../global/entity/status')
const Provider = require('../../provider/entity/provider')
const sequelize = require('../../../global/config/getSequelize')()

ex.userDetails = async (userId = null) => {
    if (userId === null) throw new NeedLoginException()
    
    const userDetails = await Account.findOne({
        where: { userId },
        attributes: ['money']
    })

    const totalCharge = (await Order.sum("totalCharge", {
        where: { userId }
    }))?.toLocaleString() || 0

    const totalOrder = (await Order.count({
        where: { userId }
    }))?.toLocaleString() || 0

    const orderStatus = {} 

    await Order.findAll({
        where: { userId },
        attributes: ["status", [sequelize.fn("COUNT", sequelize.col("status")), "count"]],
        group: ["status"],
        raw: true
    }).then(orders => orders.forEach(val => {
        orderStatus[val.status] = val.count
    }))

    const endDate = getLastWeekDate()
    const truncWithIntervalLiteral = literal("DATE_TRUNC('day', \"updatedAt\")::date");

    const orderDetails = (await Order.findAll({
        where: { 
            userId,
            updatedAt: {
                [Op.gte]: endDate,
            }
         },
        attributes: [
            "status", 
            [truncWithIntervalLiteral, "dayly"],
            [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('updatedAt'))), 'count'],
        ],
        group: ["dayly", "status"],
        raw: true
    }))

    return {
        userDetails,
        totalCharge,
        totalOrder,
        orderStatus,
        orderDetails
    }
}

ex.adminDashboard = async () => {

    const totalUserCount = await Account.count({
        where: {
            status: {
                [Op.ne]: status.deleted
            }
        }
    }) || 0

    const totalOrderCount = await Order.count() || 0
    const totalCharge = (await Account.findOne({
        where: {
            status: { [Op.ne]: status.deleted }
        },
        attributes: [ sequelize.fn("SUM", sequelize.col("money")) ],
        raw: true
    })).sum || 0

    const orderStatus = {} 

    await Order.findAll({
        attributes: ["status", [sequelize.fn("COUNT", sequelize.col("status")), "count"]],
        group: ["status"],
        raw: true
    }).then(orders => orders.forEach(val => {
        orderStatus[val.status] = val.count
    }))

    const endDate = getLastWeekDate()
    const truncWithIntervalLiteral = literal("DATE_TRUNC('day', \"updatedAt\")::date");

    const orderDetails = (await Order.findAll({
        where: { 
            updatedAt: {
                [Op.gte]: endDate,
            }
         },
        attributes: [
            "status", 
            [truncWithIntervalLiteral, "dayly"],
            [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('updatedAt'))), 'count'],
        ],
        group: ["dayly", "status"],
        raw: true
    }))

    const totalBalance = (await Provider.findOne({
        attributes: [ sequelize.fn("SUM", sequelize.col("balance")) ],
        raw: true
    })).sum || 0

    const userList = await Account.findAll({
        where: {
            createdAt: { [Op.gte]: endDate }
        }
    })
    
    return {
        totalUserCount,
        totalOrderCount,
        totalCharge,
        orderDetails,
        orderStatus,
        totalBalance,
        userList
    }
}

function getLastWeekDate() {
    const d = new Date()

    const year = d.getFullYear() // 년
    const month = d.getMonth() // 월
    const day = d.getDate() // 일
    const endDate = new Date(year, month, day - 7).toLocaleDateString()
    return endDate
}