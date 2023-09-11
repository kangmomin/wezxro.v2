const AddServiceDto = require("../dto/addServiceDto")
const CategoryIdNotFoundError = require("../../order/exception/CategoryIdNotFoundException")
const serviceRepository = require("../entity/service")
const categoryRepository = require('../../category/entity/category')
const providerRepository = require('../../provider/entity/provider')
const status = require("../../../global/entity/status")
const ProviderApi = require("../../../global/util/providerApi")
const truncate = require("../../../global/util/truncate")
const Provider = require("../../provider/entity/provider")
const NotEngoughArgsException = require("../../../global/error/exception/NotEnoughArgsException")
const Category = require("../../category/entity/category")
const { Op } = require("sequelize")
const ProviderNotFoundException = require("../../provider/exception/ProviderNotFoundException")
const CannotChangeStatusException = require("../exception/CannotChangeStatusException")

const ex = module.exports = {}

/**
 * @param {AddServiceDto} addServiceDto 
 */
ex.saveService = async (addServiceDto) => {
    addServiceDto.desc = addServiceDto.desc.trim()

    await serviceRepository.create({
        ...addServiceDto,
        providerId: addServiceDto.apiProviderId,
        categoryId: addServiceDto.category,
        type: addServiceDto.addType,
        originalRate: addServiceDto.originalPrice,
        rate: addServiceDto.price,
        description: addServiceDto.desc
    })
}

/**
 * @param {Number} serviceId 
 * @returns {Service}
 */
ex.serviceDetail = async (serviceId, rate) => {
    if (!serviceId) throw new NotEngoughArgsException()

    const service = await serviceRepository.findByPk(serviceId)

    if (rate != null) service.rate = service.rate * rate / 100

    return service
}

/**
 * 서비스로 provider 정보 추출
 * @param {Number} serviceId 
 * @returns {ProviderOrderDto}
 */
ex.addOrderInfo = async (serviceId) => {
    const service = await serviceRepository.findOne({
        where: {
            serviceId,
            status: status.active
        },
        attributes: ["apiServiceId", "providerId"]
    })

    const addOrderInfoDto = await Provider.findOne({
        where: {
            providerId: service.providerId,
            status: status.active
        },
        attributes: ["apiKey", "apiUrl"]
    })


    addOrderInfoDto.apiServiceId = service.apiServiceId

    return addOrderInfoDto
}

/**
 * 서비스의 status 업데이트
 * @param {Number} serviceId 
 * @param {String} status 
 */
ex.updateStatus = async (serviceId, cStatus) => {
    if (!serviceId) throw new NotEngoughArgsException()
    if (!cStatus in status) throw new ValidationError("status 값이 정상적이지 않습니다.")

    if (cStatus == status.active) {
        const service = await serviceRepository.findByPk(serviceId)
        const category = await Category.findByPk(service.categoryId, {
            attributes: ['status']
        })
    
        if (category.status == status.deactive) 
            throw new CannotChangeStatusException("카테고리가 비활성 상태입니다.")
            
        const provider = await Provider.findByPk(service.providerId, {
            attributes: ["status"]
        })
        if (provider.status == status.deactive) 
            throw new CannotChangeStatusException("도매처가 비활성 상태입니다.")
    }
    
    await serviceRepository.update({ status: cStatus }, {
        where: { serviceId }
    })
}
/**
 * 서비스 목록 출력
 * @param {Number} categoryId 
 */
ex.getServices = async (categoryId) => {    
    const services = categoryId == 0 ? 
        await serviceRepository.findAll({
            where: {
                status: {
                    [Op.notLike]: status.deleted,
                }
            }
        }) : await serviceRepository.findAll({
            where: {
                status: {
                    [Op.notLike]: status.deleted
                },
                categoryId
            }
        })

    const category = await categoryRepository.findAll({
        where: {
            status: {
                [Op.notLike]: status.deleted
            }
        },
    })

    return [services, category]
}

/**
 * @returns {import('../repository/categoryRepository').AddServiceCategoryDto[], []}
 */
ex.addServiceRender = async () => {
    const category = await categoryRepository.findAll({
        where: {
            status: {
                [Op.notLike]: status.deleted
            }
        },
        attributes: ["categoryId", "name"]
    })
    const provider = await providerRepository.findAll({
        where: {
            status: status.active
        },
        attributes: ["providerId", "name"]
    })
    
    return [category, provider]
}


/**
 * service 들을 가져오는데 html로 파싱해서 return함
 * @param {Number} providerId  
 * @returns {String} htmlCode
 */
ex.providerServices = async (providerId) => {
    const providerInfo = await providerRepository.findOne({
        attributes: ["apiKey", "apiUrl", 'type'],
        where: {
            status: {
                [Op.notLike]: status.deleted
            },
            providerId: providerId,
            status: status.active
        }
    })

    if (!providerInfo) throw new ProviderNotFoundException()

    const api = new ProviderApi(providerInfo.apiKey, providerInfo.apiUrl, providerInfo.type)
    let services = await api.getServices()
    const result = {}

    try {
        services.forEach(e => {
            if (result[e.category] == undefined) result[e.category] = []
            
            e.content = truncate(`ID${e.service} - (${e.rate}) - ${e.name}`, 75)
            result[e.category].push(e)
        })
    } catch(e) {
        return []
    }
    
    return result
}

ex.serviceList = async (categoryId, rate) => {
    if (!categoryId) throw new NotEngoughArgsException()

    const option = categoryId != 0 ? {
        where: { 
            categoryId, 
            status: status.active
        }
    } : {
        where: {
            status: status.active
        }
    }

    let services = await serviceRepository.findAll(option)

    services = services.map(s => {
        if (rate != null) s.rate = s.rate * rate / 100
        return s
    })

    option.attributes = ['name']

    const categoryName = await Category.findOne(option)

    return [services, categoryName.name]
}

ex.mainServiceList = async (rate) => {
    let services = await serviceRepository.findAll({
        where: {status: status.active},
    })
    const category = await categoryRepository.findAll({
        where: {status: status.active},
        attributes: ['categoryId', 'name']
    })
    
    services = services.map(s => {
        if (rate != null) s.rate = s.rate * rate / 100
        return s
    })
    
    return [services, category]
}

ex.deleteService = async (serviceId) => {
    if (!serviceId) throw new NotEngoughArgsException()

    await serviceRepository.update({
        status: status.deleted
    }, {
        where: { serviceId }
    })
}

ex.allService = async () => {
    return await serviceRepository.findAll({
        where: {
            status: { [Op.notLike]: status.deleted }
        }
    })
}