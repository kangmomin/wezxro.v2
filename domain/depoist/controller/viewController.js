const isAuthUser = require('../../../global/config/filter/isAuthUser')
const renderIsAdmin = require('../../../global/config/filter/renderIsAdmin')
const ExceptionHandler = require('../../../global/error/ExceptionHandler')
const { info } = require('../../account/service/accountService')
const { depoistRender, findForUpdate, allDepoist } = require('../service/depoistService')

const app = require('express').Router()

app.get('/transactions', isAuthUser, async (req, res) => {
    try {
        const user = await info(req)
        const depoistList = await depoistRender(req.session.userId)

        res.render(__dirname + '/../view/transactions', {
            result: req.query.result || "default",
            ...user,
            depoist: depoistList,
            path: "transactions",
            isDemo: req.session.isDemo
        })
    } catch (e) {
        ExceptionHandler(res, e)
    }
})

app.get('/admin/transactions', renderIsAdmin, async (req, res) => {
    try {
        const depoistList = await allDepoist()

        res.render(__dirname + '/../view/admin/transactions', {
            result: req.query.result || "default",
            depoists: depoistList,
            path: "transactions"
        })
    } catch (e) {
        ExceptionHandler(res, e)
    }
})

app.get('/admin/transactions/update/:depoistId', async (req, res) => {
    try {
        const depoist = await findForUpdate(req.params.depoistId)

        res.render(__dirname + '/../view/assets/updateTransaction', { d: depoist })
    } catch (e) {
        ExceptionHandler(res, e)
    }
})

module.exports = app