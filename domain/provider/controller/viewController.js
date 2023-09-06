const renderIsAdmin = require('../../../global/config/filter/renderIsAdmin')
const ExceptionHandler = require('../../../global/error/ExceptionHandler')
const { providerList } = require('../service/providerService')

const app = require('express').Router()

app.get("/admin/provider/update", (req, res) => res.render('assets/addProvider'))

app.get('/admin/provider', renderIsAdmin, async (req, res) => {
    try {
        const providers = await providerList()
        res.render('admin/provider', {
            providers
        })
    } catch(e) {
        ExceptionHandler(res, e)
    }
})

module.exports = app