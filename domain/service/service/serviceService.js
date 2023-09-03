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
const { async } = require("fast-glob")

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
ex.serviceDetail = async (serviceId) => {
    const service = await serviceRepository.findByPk(serviceId)

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
ex.updateStatus = async (serviceId, status) => {
    const conn = await new DB().getConn()
    
    
    try {
        await serviceRepository.updateStatus(conn, serviceId, status)
        await conn.commit()
    } catch(e) {
        await conn.rollback()
        throw e
    } finally {
        conn.release()
    }
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
                    [Op.notLike]: status.deleted
                },
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
            status: {
                [Op.notLike]: status.deleted
            }
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
        attributes: ["apiKey", "apiUrl"],
        where: {
            status: {
                [Op.notLike]: status.deleted
            },
            providerId: providerId,
            status: status.active
        }
    })

    const api = new ProviderApi(providerInfo.apiKey, providerInfo.apiUrl)
    let services = await api.getServices()
    const result = {}

    services.forEach(e => {
        if (result[e.category] == undefined) result[e.category] = []
        
        e.content = truncate(`ID${e.service} - (${e.rate}) - ${e.name}`, 75)
        result[e.category].push(e)
    })
    
    return result
}

ex.serviceList = async (categoryId) => {
    if (!categoryId) throw new NotEngoughArgsException()

    const option = categoryId != 0 ? {
        where: { 
            categoryId, 
            status: {
                [Op.notLike]: status.deleted
            }
        }
    } : {
        where: {
            status: {
                [Op.notLike]: status.deleted
            }
        }
    }

    const services = await serviceRepository.findAll(option)

    option.attributes = ['name']

    const categoryName = await Category.findOne(option)

    return [services, categoryName.name]
}

ex.mainServiceList = async () => {
    const services = await serviceRepository.findAll({
        where: {status: status.active},
    })
    const category = await categoryRepository.findAll({
        where: {status: status.active},
        attributes: ['categoryId', 'name']
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