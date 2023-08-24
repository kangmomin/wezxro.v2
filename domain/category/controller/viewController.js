const app = require('express').Router()
const renderIsAdmin = require('../../../global/config/filter/renderIsAdmin')
const adminCategoryService = require('../service/adminCategoryService')

app.get('/admin/category', renderIsAdmin, async (req, res) => {
    const [category, activeCnt] = await adminCategoryService.findAllCategory()
    
    res.render('admin/category', {
        category, activeCnt
    })
})

module.exports = app