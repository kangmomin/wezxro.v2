const ProviderApi = require('../../../global/util/providerApi')
const ProviderNotFoundException = require('../exception/ProviderNotFoundException')
const providerRepository = require('../entity/provider')
const SaveProviderDto = require('../dto/SaveProviderDto')
const status = require('../../../global/entity/status')
const UnknownProviderException = require('../exception/UnknownProviderException')
const NotEngoughArgsException = require('../../../global/error/exception/NotEnoughArgsException')
const ApiException = require('../../../global/error/exception/ApiException')

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
    try {
        await new ProviderApi(providerInfo.key, providerInfo.url)
            .getUserBalance()
    } catch (e) {
        throw new UnknownProviderException()
    }

    if (!providerInfo.name) return NotEngoughArgsException()

    await providerRepository.create({
        userId: userId,
        name: providerInfo.name, 
        description: providerInfo.description,
        apiKey: providerInfo.key,
        apiUrl: providerInfo.url,
        status: providerInfo.status == 1 ? status.active : status.deactive
    })
}

ex.providerList = async () => {
    let providers = await providerRepository.findAll({
        attributes: ["providerId", "name", "description", 
            "status", "apiKey", "apiUrl"]
    })

    providers = await Promise.all(providers.map(async p => {
        return await new ProviderApi(p.apiKey, p.apiUrl)
            .getUserBalance()
            .then(pi => {
                p.balance = !pi.error ? pi.balance : pi.error
                p.apiKey = undefined
                p.apiUrl = p.apiUrl.split("/api")[0]
        
                return p
            })
            .catch(e => { 
                p.balance = e.response.data.error
                p.apiKey = undefined
                p.apiUrl = p.apiUrl.split("/api")[0]
        
                return p
            })
    }))

    return providers
}

ex.deleteProvider = async (providerId) => {
    if (!provideId) throw new NotEngoughArgsException()
    
    await providerRepository.update({
        status: status.deleted
    }, {where: { providerId }})
}