const app = require("express").Router()
const viewController = require('./viewController')

app.use(viewController)

module.exports = app