const app = require('express').Router()
const ExceptionHandler = require('../../../global/error/ExceptionHandler')
const orderService = require('../service/orderService')
const accountService = require('../../account/service/accountService')
const categoryService = require('../../category/service/categoryService')

app.get("/order", async (req, res) => {
    try {
        const orders = await orderService.findByUserId(req.session.userId)
        const user = await accountService.info(req)
        
        orders.map(e => {
            e.created = formatDateTime(e.created)
            return e
        })
        
        res.render('order', { orders, ...user, path: "order" })
    } catch (e) {
        ExceptionHandler(res, e)
    }
})

app.get("/add-order", async (req, res) => {
    try {
        
        const { name, money } = await accountService.info(req)
        const category = await categoryService.findAllCategory()
        
        res.render('addOrder', {
            name, money, category, path: "add-order"
        })
    } catch(e) {
        ExceptionHandler(res, e)
    }
})

/**
 * 카테고리에 속하는 서비스 목록 요청
 * HTML 코드 리턴
*/
app.post('/order/get_services/:categoryId', async (req, res) => {
    try {
        const categoryId = req.params.categoryId || null
        
        const service = await orderService.findServiceByCategoryId(categoryId)
        
        res.render("assets/service_list", {
            result: service
        })
    } catch(e) {
        ExceptionHandler(res, e)
    }
})

module.exports = app