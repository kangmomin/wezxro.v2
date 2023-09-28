const ProviderApi = require('../../../global/util/providerApi')
const ProviderNotFoundException = require('../exception/ProviderNotFoundException')
const providerRepository = require('../entity/provider')
const SaveProviderDto = require('../dto/SaveProviderDto')
const status = require('../../../global/entity/status')
const UnknownProviderException = require('../exception/UnknownProviderException')
const NotEngoughArgsException = require('../../../global/error/exception/NotEnoughArgsException')
const Service = require('../../service/entity/service')
const type = require('../entity/constant/type')
const Provider = require('../entity/provider')
const ApiException = require('../../../global/error/exception/ApiException')
const { sequelize } = require('../..')

const ex = module.exports = {}

/**
* @param {Number} providerId
* @typedef ApiServiceDto
* @property {Number} service 서비스 ID
* @property {String} name 서비스 이름
* @property {String} rate float의 평점
* @property {Number} min 최소 값
* @property {Number} max 최댓 값
* @property {String} category 카테고리
* @property {String} type 
* @property {Number} refill 
* @property {Number} dripfeed 
* @property {Number} cancel 
*
* @returns {ApiServiceDto[]}
*/
ex.findServices = async (providerId = null) => {
    if (providerId === null) throw new ProviderNotFoundException()

    const res = await providerRepository.findByPk(providerId)

    const provider = new ProviderApi(res.api_key, res.api_url)
    const services = await provider.getServices()
    const result = {}

    services.forEach(e => {
        if (result[e.category] == undefined) result[e.category] = []

        result[e.category].push(e)
    });

    await conn.commit()

    return result
}

/** @param {SaveProviderDto} providerInfo */
ex.saveProvider = async (providerInfo, userId) => {
    let isFormData = type.json
    let balance
    
    try {
        let res = await new ProviderApi(providerInfo.key, providerInfo.url)
            .getUserBalance()

        if (res.error) {
            balance = await new ProviderApi(providerInfo.key, providerInfo.url, true)
                .getUserBalance().then(() => isFormData = type.formData)
        } else {
            balance = res.balance
        }

    } catch (e) {
        throw new UnknownProviderException()
    }

    if (!providerInfo.name) return NotEngoughArgsException()

    if (providerInfo.id) {
        await providerRepository.update({
            name: providerInfo.name, 
            description: providerInfo.description,
            apiKey: providerInfo.key,
            apiUrl: providerInfo.url,
            status: providerInfo.status == 1 ? status.active : status.deactive,
            balance: balance,
            type: isFormData    
        }, {
            where: {
                providerId: providerInfo.id
            }
        })
    } else {
        await providerRepository.create({
            userId: userId,
            name: providerInfo.name, 
            description: providerInfo.description,
            apiKey: providerInfo.key,
            apiUrl: providerInfo.url,
            status: providerInfo.status == 1 ? status.active : status.deactive,
            type: isFormData,
            balance: balance
        })
    }
}

ex.providerList = async () => {
    let providers = await providerRepository.findAll({
        attributes: ["providerId", "name", "description", 
            "status", "apiUrl", "type", "balance"],
        order: sequelize.col("providerId")
    })

    return providers
}

ex.updateBalance = async (providerId) => {

    const apiInfo = await Provider.findByPk(providerId, {
        attributes: ["apiKey", "apiUrl", "type"]
    })

    const provider = new ProviderApi(apiInfo.apiKey, apiInfo.apiUrl, apiInfo.type)
    const balance = await provider.getUserBalance()

    if (balance.error) {
        throw new ApiException()
    }

    await Provider.update({ balance: balance.balance }, {
        where: { providerId }
    })
}

ex.updateStatus = async (providerId = null, cStatus) => {
    if (!providerId) throw new NotEngoughArgsException()
    if (!cStatus in status) throw new ValidationError("status 값이 정상적이지 않습니다.")

    await providerRepository.update({ status: cStatus }, {
        where: { providerId }
    })

    if (cStatus == status.deactive)
        await Service.update({
            status: status.deactive
        }, {
            where: {
                status: status.active,
                providerId
            }
        })
}

ex.providerInfo = async (providerId = null) => {

    if (!providerId) throw new NotEngoughArgsException()

    const provider = await providerRepository.findByPk(providerId)
    
    if (!provider) throw new UnknownProviderException()

    return provider
}

ex.providerDelete = async (providerId = null) => {
    if (!providerId) throw new NotEngoughArgsException()
    
    await providerRepository.destroy({
        where: { providerId }
    })
}