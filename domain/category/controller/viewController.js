const app = require('express').Router()
const renderIsAdmin = require('../../../global/config/filter/renderIsAdmin')
const ExceptionHandler = require('../../../global/error/ExceptionHandler')
const adminCategoryService = require('../service/adminCategoryService')

app.get('/admin/category', renderIsAdmin, async (req, res) => {
    const [category, activeCnt] = await adminCategoryService.findAllCategory()
    
    res.render('admin/category', {
        category, activeCnt
    })
})

app.get('/admin/category/update', (_, res) => {
    res.render(__dirname+"/../view/assets/category_store")
})

app.get('/admin/category/update/:categoryId', async (req, res) => {
    try {
        const category = await adminCategoryService.getCategoryDetail(req.params.categoryId)
        
        res.render(__dirname + "/../view/assets/category_edit", {
            categoryId: category.categoryId,
            name: category.name,
            sort: category.sort,
            status: category.status
        })
    } catch(e) {
        ExceptionHandler(res, e)
    }
    
})

module.exports = app