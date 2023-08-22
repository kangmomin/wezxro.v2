const express = require('express')
const app = express.Router()

const providerService = require('../service/providerService') 
const SaveProviderDto = require('../dto/SaveProviderDto')
const ExceptionHandler = require('../../../global/error/ExceptionHandler')
const isAdmin = require('../../../global/config/isAdmin')

app.post('/admin/services/provider_services/', async (req, res) => {
    try {
        const providerId = req.body.provider_id || null

        const service = await providerService.findServices(providerId)

        let html = `<option value="0">Choose Service</option>`
        
        for (category of Object.keys(service)) {
            html += `<optgroup label="${category}">`
            service[category].forEach(e => {
                html += `
                <option value="${e.service}" data-service="${e.service}" 
                data-name="${e.name}" data-type="${e.type}" 
                data-rate="${e.rate}" data-min="${e.min}" data-max="${e.max}" 
                data-dripfeed="${e.dripfeed}" data-refill="${e.refill}" 
                data-cancel="${e.cancel}" data-category="${e.category}">
                ID${e.service} - (${e.rate}) - ${e.name}
                </option>`
            })
            html += `</optgroup>`
        }
        
        res.send(html)
    } catch(e) {
        if (typeof e === ProviderIdNotFoundError) {
            errMsg = "카테고리 아이디가 필요합니다."
        } else {
            console.error(e)
        }

        res.send('')
    }
})

app.post("/admin/provider/store", isAdmin, async (req, res) => {
    try {
        await providerService.saveProvider(
            new SaveProviderDto(req.body), 
            req.session.userId)
        res.send(JSON.stringify({
            message: "도매처 추가 성공",
            status: "success"
        }))
    } catch(e) {
        ExceptionHandler(res, e)
    }
})

module.exports = app