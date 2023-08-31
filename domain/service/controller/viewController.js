const app = require("express").Router()
const { NOT_ENOUGH_ARGS } = require("../../../global/error/ErrorCode")
const serviceService = require('../service/serviceService')
const accountService = require('../../account/service/accountService')
const ExceptionHandler = require('../../../global/error/ExceptionHandler')

app.get('/admin/services', async (req, res) => {
    try {
        const categoryId = req.query.sort_by || 0
        
        const [services, category] = await serviceService.getServices(categoryId)
        
        res.status(200).render('admin/services', {
            path: "services",
            services, 
            category: category,
            sort_by: categoryId
        })
    } catch(e) {
        ExceptionHandler(res, e)
    }
})

app.get('/services', async (req, res) => {
    try {
        const user = await accountService.info(req)
        const [services, category] = await serviceService.mainServiceList()
        
        res.render('services', {
            path: "services",
            ...user,
            services,
            category
        })
    } catch(e) {
        ExceptionHandler(res, e)
    }
})

app.get('/admin/services/update', async (req, res) => {
    try {
        const [category, provider] = await serviceService.addServiceRender()
                    
        return res.status(200).render('assets/services_update', {
            category, 
            providers: provider
        })
    } catch (e) {
        ExceptionHandler(res, e)
    }
})

app.post('/admin/services/provider_services', async (req, res) => {
    try {
        const provider_id = req.body.provider_id | null
    
        if (!provider_id) throw new NOT_ENOUGH_ARGS()
    
        const result = await serviceService.providerServices(provider_id)
    
        return res.status(200).render("assets/service_list", { result })
    } catch(e) {
        ExceptionHandler(res, e)
    }
})

module.exports = app