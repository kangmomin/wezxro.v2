const AddServiceDto = require("../dto/addServiceDto")
const CategoryIdNotFoundError = require("../../order/exception/CategoryIdNotFoundException")
const serviceRepository = require("../entity/service")
const categoryRepository = require('../../category/entity/category')
const providerRepository = require('../../provider/entity/provider')
const status = require("../../../global/entity/status")
const ProviderApi = require("../../../global/util/providerApi")
const truncate = require("../../../global/util/truncate")

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

    const conn = await new DB().getConn()

    try {
        const service = await serviceRepository.findById(conn, serviceId)
    
        await conn.commit()
        return service
    } catch(e) {
        await conn.rollback()
        throw e
    } finally {
        conn.release()
    }
}

/**
 * 서비스로 provider 정보 추출
 * @param {Number} serviceId 
 * @returns {ProviderOrderDto}
 */
ex.addOrderInfo = async (serviceId) => {

    const conn = await new DB().getConn()

    try {
        const addOrderInfoDto = await serviceRepository.addOrderInfo(conn, serviceId)
    
        await conn.commit()
        return addOrderInfoDto
    } catch(e) {
        await conn.rollback()
        throw e
    } finally {
        conn.release()
    }
    
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
    const services = categoryId == 0 ? await serviceRepository.findAll()
                        : await serviceRepository.findAll({
                            where: {
                                categoryId
                            }
                        })

    const category = await categoryRepository.findAll()

    return [services, category]
}

/**
 * @returns {import('../repository/categoryRepository').AddServiceCategoryDto[], []}
 */
ex.addServiceRender = async () => {
    const category = await categoryRepository.findAll({
        attributes: ["categoryId", "name"]
    })
    const provider = await providerRepository.findAll({
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