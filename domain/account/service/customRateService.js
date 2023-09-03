const { QueryTypes } = require("sequelize")
const getSequelize = require("../../../global/config/getSequelize")
const NotEngoughArgsException = require("../../../global/error/exception/NotEnoughArgsException")
const CustomRate = require("../entity/customRate")

const ex = module.exports = {}

ex.add = async (serviceInfo, userId, rate) => {
    await CustomRate.create({
        userId: Number(userId), 
        rate: Number(rate), 
        serviceId: Number(serviceInfo.service_id)
    })
}

ex.viewCustomRate = async (userId = null) => {
    if (!userId) throw new NotEngoughArgsExceptionn()

    const cr = await getSequelize().query(` 
        SELECT 
            *, cr.rate as customRate
        FROM 
            custom_rate cr 
        INNER JOIN
            service s
        ON
            s.service_id = cr.service_id
        WHERE
            cr.user_id = ?
        ORDER BY
            cr.service_id ASC;
    `, {
        type: QueryTypes.SELECT,
        replacements: [userId]
    })
    
    return cr
}
