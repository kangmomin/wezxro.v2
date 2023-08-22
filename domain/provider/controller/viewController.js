const renderIsAdmin = require('../../../global/config/filter/renderIsAdmin')
const { providerList } = require('../service/providerService')

const app = require('express').Router()

app.get("/admin/provider/update", (req, res) => res.render('assets/addProvider'))

app.get('/admin/provider', renderIsAdmin, async (req, res) => {
    const providers = await providerList()
    res.render('admin/provider', {
        providers
    })
})

module.exports = app