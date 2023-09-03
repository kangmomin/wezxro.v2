const ProviderApi = require("../../../global/util/providerApi")
const OrderViewDto = require("../dto/OrderViewDto")
const SaveOrderDto = require("../dto/SaveOrderDto")
const orderRepository = require('../entity/order')
const serviceRepository = require('../../service/entity/service')
const providerRepository = require('../../provider/entity/provider')
const CategoryIdNotFoundError = require("../exception/CategoryIdNotFoundException")
const status = require("../../../global/entity/status")
const { Op } = require("sequelize")

const ex = module.exports = {}

/**
 * @param {SaveOrderDto} saveOrderDto 
 */
ex.saveOrder = async (saveOrderDto) => {
    await orderRepository.create(saveOrderDto)
}

ex.findAll = async () => {
    return await orderRepository.findAll()
}

/**
 * @param {Number} userId
 * @returns {OrderViewDto[]}
 */
ex.findByUserId = async (userId) => {
    
    const orders = await orderRepository.findAll({
        where: {
            userId
        },
        attributes: [
            "orderId", "serviceId", "totalCharge", 
            "quantity", "link", "createdAt", "apiOrderId"
        ]
    })

    const serviceIds = orders.map(o => o.serviceId);
    
    const service = await serviceRepository.findAll({
        where: {
            serviceId: serviceIds,
        },
        attributes: ["name", "providerId"]
    })

    const providerIds = service.map(s => s.providerId);
    
    const provider = await providerRepository.findAll({
        where: {
            providerId: providerIds
        },
        attributes: ["apiKey", "apiUrl"]
    })
    
    let orderWithStatus = []
    
    let i = 0
    for (o of orders) {
        const api = new ProviderApi(provider[i].apiKey, provider[i].apiUrl)
        
        o.status = await api.getOrderStatus(o.apiOrderId)
        o.serviceName = service[i].name
        
        orderWithStatus.push(o)

        i++
    }
    
    return orderWithStatus
}

/**
 * @param {Number} categoryId 
 */
ex.findServiceByCategoryId = async (categoryId, rate) => {

    if (categoryId === null) {
        throw new CategoryIdNotFoundError()
    }
    let services = await serviceRepository.findAll({
        where: {
            categoryId,
            status: status.active
        }
    })

    services = services.map(s => {
        if (rate != null) s.rate = s.rate * rate / 100
        return s
    })
    
    return services
}
