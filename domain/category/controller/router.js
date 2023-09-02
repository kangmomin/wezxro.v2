const app = require('express').Router()
const viewController = require("./viewController")
const categoryController = require('./apiController')

app.use(viewController)
app.use(categoryController)

module.exports = app