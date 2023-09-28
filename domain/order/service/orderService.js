const ProviderApi = require("../../../global/util/providerApi")
const OrderViewDto = require("../dto/OrderViewDto")
const SaveOrderDto = require("../dto/SaveOrderDto")
const orderRepository = require('../entity/order')
const serviceRepository = require('../../service/entity/service')
const providerRepository = require('../../provider/entity/provider')
const CategoryIdNotFoundError = require("../exception/CategoryIdNotFoundException")
const status = require("../../../global/entity/status")
const { Op } = require("sequelize")
const ApiException = require("../../../global/error/exception/ApiException")
const Account = require("../../account/entity/account")
const Provider = require("../../provider/entity/provider")
const Service = require("../../service/entity/service")
const NotEngoughArgsException = require("../../../global/error/exception/NotEnoughArgsException")
const UpdateOrderDto = require("../dto/UpdateOrderDto")

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
            "quantity", "link", "createdAt", "apiOrderId",
            "remain", "startCnt"
        ]
    })

    let orderWithStatus = []

    let i = 0
    for (o of orders) {
        const service = await serviceRepository.findByPk(o.serviceId, {
            attributes: ["name", "providerId"]
        })
        const provider = await providerRepository.findByPk(service.providerId, {
            attributes: ["apiKey", "apiUrl", "type"]
        })

        const api = new ProviderApi(provider.apiKey, provider.apiUrl, provider.type)

        o = await api.getOrderStatus(o.apiOrderId)
            .then(order => {
                o.serviceName = service.name
                if (order.error) {
                    o.status = order.error
                    return o
                }

                orderRepository.update({ 
                    status: order.status.toLocaleLowerCase()
                }, {
                    where: { orderId: o.orderId }
                })
        
                if (!o.remain) o.remain = order.remains
                if (!o.startCnt) o.startCnt = order.start_count
                if (!o.status) o.status = order.status
                return o
            })
            .catch(e => {
                o.status = ""
                o.serviceName = service.name + "[" + e.response.data.error + "]"
                return o
            })

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

ex.orders = async () => {
    let orders = await orderRepository.findAll()

    // provider 나눠서 multiple status 로 변환 가능할 것 같음
    orders = await Promise.all(orders.map(async order => {
        const service = await Service.findByPk(order.serviceId, { 
            attributes: ["providerId", "name"] 
        })

        order.name = service.name
        
        const provider = await Provider.findByPk(service.providerId, {
            attributes: ["providerId", "name", "apiKey", "apiUrl", "type"]
        })
        order.provider = provider
        const user = await Account.findByPk(order.userId, {
            attributes: ["email"]
        })
        order.email = user.email

        return await new ProviderApi(
            provider.apiKey,
            provider.apiUrl,
            provider.type
        ).getOrderStatus(order.apiOrderId)
        .then(apiOrderStatus => {
            
            if (order.error) {
                order.status = order.error
                return order
            }
    
            if (!order.remain) order.remain = apiOrderStatus.remains
            if (!order.startCnt) order.startCnt = apiOrderStatus.start_count
            if (!order.status) order.status = apiOrderStatus.status
            return order
        })
        .catch(e => {
            order.status = "api 에러"
            return order
        })
    }))



    return orders
}

ex.orderDetail = async (orderId = null) => {
    if (!orderId) throw new NotEngoughArgsException()

    const order = await orderRepository.findByPk(orderId)
    const providerInfo = await serviceRepository.findByPk(order.serviceId,
        {attributes: ["providerId"]})
    const provider = await providerRepository.findByPk(providerInfo.providerId)

    const apiOrderStatus = await new ProviderApi(
        provider.apiKey,
        provider.apiUrl,
        provider.type)
        .getOrderStatus(order.apiOrderId)

    if (!order.remain) order.remain = apiOrderStatus.remains
    if (!order.startCnt) order.startCnt = apiOrderStatus.start_count
    if (!order.startCnt) order.status = apiOrderStatus.status

    return order
}

/**
 * 
 * @param {UpdateOrderDto} UpdateOrderDto 
 */
ex.updateOrder = async (updateOrderDto) => {
    await orderRepository.update(updateOrderDto, {
        where: { orderId: updateOrderDto.orderId }
    })
}