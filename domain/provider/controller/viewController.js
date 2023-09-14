const renderIsAdmin = require('../../../global/config/filter/renderIsAdmin')
const ExceptionHandler = require('../../../global/error/ExceptionHandler')
const { providerList, providerInfo } = require('../service/providerService')

const app = require('express').Router()

app.get("/admin/provider/update", (req, res) => res.render(__dirname + '/../view/assets/addProvider'))

app.get('/admin/provider', renderIsAdmin, async (req, res) => {
    try {
        const providers = await providerList()
        res.render(__dirname + '/../view/admin/provider', {
            providers
        })
    } catch(e) {
        ExceptionHandler(res, e)
    }
})

app.get('/admin/provider/update/:providerId', async (req, res) => {
    try {
        const provider = await providerInfo(req.params.providerId)
        
        res.render(__dirname + '/../view/assets/updateProvider.ejs', {
            provider
        })
    } catch(e) {
        ExceptionHandler(res, e)
    }
})

module.exports = app