const ExceptionHandler = require('../../../global/error/ExceptionHandler')
const { info } = require('../../account/service/accountService')
const { depoistRender } = require('../service/depoistService')

const app = require('express').Router()

app.get('/transactions', async (req, res) => {
    try {
        const user = await info(req)
        const depoistList = await depoistRender(req.session.userId)

        res.render('transactions', {
            result: req.query.result || "default",
            ...user,
            depoist: depoistList,
            path: "transactions"
        })
    } catch (e) {
        ExceptionHandler(res, e)
    }
})

module.exports = app