const AddServiceDto = require("../dto/addServiceDto")
const CategoryIdNotFoundError = require("../exception/CategoryIdNotFoundException")
const serviceRepository = require("../entity/service")
const categoryRepository = require('../../category/entity/category')

const ex = module.exports = {}

/**
 * @param {Number} categoryId 
 * @returns {String} html code
 */
ex.findByCategoryIdFormat = async (categoryId) => {

    if (categoryId === null) {
        throw new CategoryIdNotFoundError()
    }

    const conn = await new DB().getConn()

    try {
        const services = await serviceRepository.findByCategoryId(conn, categoryId)
        await conn.commit()
    
        let html = `
        <label style="margin-bottom: 8px;">서비스를 선택해주세요.</label>
        <select name="service_id" class="form-control square ajaxChangeService" data-url="/add-order/get_service/">
            <option> 서비스를 선택해주세요.</option>`
    
        services.forEach(e => {
            html +=`<option value="${e.serviceId}" data-type="default" data-dripfeed="0">
                ID${e.serviceId} - ${e.name} - ₩${e.rate}</option>`
        })
    
        html += "</select>"
    
        return html
    } catch(e) {
        await conn.rollback()
        throw e
    } finally {
        conn.release()
    }
}

/**
 * @param {AddServiceDto} addServiceDto 
 */
ex.saveService = async (addServiceDto) => {
    addServiceDto.desc = addServiceDto.desc.trim()
    const conn = await new DB().getConn()

    try {
        await serviceRepository.saveService(conn, addServiceDto)
        await conn.commit()
    } catch(e) {
        await conn.rollback()
        throw e
    } finally {
        conn.release()
    }
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