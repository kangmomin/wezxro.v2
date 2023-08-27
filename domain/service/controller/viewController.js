const app = require("express").Router()
const serviceService = require('../service/serviceService')

app.get('/admin/services', async (req, res) => {
    try {
        const categoryId = req.query.sort_by || 0
        
        const [services, category] = await serviceService.getServices(categoryId)
        
        res.render('admin/services', {
            path: "services",
            services, 
            category: category,
            sort_by: categoryId
        })
    } catch(e) {
        ExceptionHandler(res, e)
    }
})

module.exports = app