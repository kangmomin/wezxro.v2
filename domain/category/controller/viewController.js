const app = require('express').Router()
const renderIsAdmin = require('../../../global/config/filter/renderIsAdmin')
const adminCategoryService = require('../service/adminCategoryService')

app.get('/admin/category', renderIsAdmin, async (req, res) => {
    const [category, activeCnt] = await adminCategoryService.findAllCategory()
    
    res.render('admin/category', {
        category, activeCnt
    })
})

app.get('/admin/category/update', async (_, res) => res.render(__dirname + "/../view/assets/category_update"))

module.exports = app