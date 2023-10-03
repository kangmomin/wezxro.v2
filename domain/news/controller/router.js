const app = require('express').Router()
const viewController = require("./viewController")
const apiController = require("./apiController")

app.use(viewController)
app.use(apiController)

module.exports = app