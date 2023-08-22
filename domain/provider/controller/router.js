const app = require('express').Router()
const viewController = require('./viewController')
const providerController = require('./providerController')

app.use(viewController)
app.use(providerController)

module.exports = app