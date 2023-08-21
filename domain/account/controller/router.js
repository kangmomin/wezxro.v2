const app = require('express').Router()
const viewController = require('./viewController')
const accessController = require('./accessController')

app.use(viewController)
app.use(accessController)

module.exports = app