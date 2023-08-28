const ProviderApi = require("../../../global/api/providerApi")
const OrderViewDto = require("../dto/OrderViewDto")
const SaveOrderDto = require("../dto/SaveOrderDto")
const orderRepository = require('../entity/order')
const serviceRepository = require('../../service/entity/service')
const providerRepository = require('../../provider/entity/provider')

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
    const providerIds = orders.map(o => o.providerId);

    const service = await serviceRepository.findAll({
        where: {
            serviceId: serviceIds
        },
        attributes: ["name"]
    })
    
    const provider = await providerRepository.findAll({
        where: {
            providerId: providerIds
        },
        attributes: ["apiKey", "apiUrl"]
    })
    
    let orderWithStatus = []
    
    if (orders.length > 0)
        await Promise.all(orders.forEach(async (o, i) => {
            const api = new ProviderApi(o.api_key, o.api_url)
            
            o.status = await api.getOrderStatus(o.api_order_id)
            o.serviceName = service[i].name
            o.apiKey = provider[i].apiKey
            o.apiApi = provider[i].apiApi
            
            orderWithStatus.push(o)
        }))
    
    return orderWithStatus
}