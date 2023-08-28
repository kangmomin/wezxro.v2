const app = require('express').Router()
const ExceptionHandler = require('../../../global/error/ExceptionHandler')
const orderService = require('../service/orderService')
const accountService = require('../../account/service/accountService')

app.get("/order", async (req, res) => {
    try {
      const orders = await orderService.findByUserId(req.session.userId)
      const user = await accountService.info(req)
  
      orders.map(e => {
        e.created = formatDateTime(e.created)
        return e
      })
  
      res.render('order', { orders, user })
    } catch(e) {
        ExceptionHandler(res, e)
    }
  })
  

module.exports = app