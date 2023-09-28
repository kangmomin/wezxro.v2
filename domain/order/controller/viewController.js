const app = require('express').Router()
const ExceptionHandler = require('../../../global/error/ExceptionHandler')
const orderService = require('../service/orderService')
const accountService = require('../../account/service/accountService')
const categoryService = require('../../category/service/categoryService')
const formatDateTime = require('../../../global/util/formatDateTime')
const renderIsAdmin = require('../../../global/config/filter/renderIsAdmin')
const isAuthUser = require('../../../global/config/filter/isAuthUser')

app.get("/order", isAuthUser, async (req, res) => {
    try {
        const orders = await orderService.findByUserId(req.session.userId)
        const user = await accountService.info(req)
        
        orders.map(e => {
            e.created = formatDateTime(e.createdAt)
            return e
        })
        
        res.render(__dirname + '/../view/order', { orders, ...user, path: "order" })
    } catch (e) {
        ExceptionHandler(res, e)
    }
})

app.get("/add-order", isAuthUser, async (req, res) => {
    try {
        
        const { name, money } = await accountService.info(req)
        const category = await categoryService.findAllCategory()
        
        res.render(__dirname + '/../view/addOrder', {
            name, money, category, path: "add-order"
        })
    } catch(e) {
        ExceptionHandler(res, e)
    }
})
app.get("/admin/order", renderIsAdmin, async (req, res) => {
    try {
        const orders = await orderService.orders()
        
        res.render(__dirname + '/../view/admin/order', {
            path: "order",
            orders
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
        
        const service = await orderService.findServiceByCategoryId(categoryId, req.session.rate)
        
        res.render(__dirname + "/../view/assets/service_list", {
            result: service
        })
    } catch(e) {
        ExceptionHandler(res, e)
    }
})

app.get("/admin/order/update/:orderId", async (req, res) => {
    try {
        const o = await orderService.orderDetail(req.params.orderId)

        res.render(__dirname + "/../view/assets/editOrder", {
            status: o.status,
            orderId: o.orderId,
            quantity: o.quantity,
            totalCharge: o.totalCharge,
            link: o.link,
            remain: o.remain,
            startCnt: o.startCnt,
        })
    } catch(e) {
        ExceptionHandler(res, e)
    }
})

module.exports = app