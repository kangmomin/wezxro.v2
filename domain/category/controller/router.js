const app = require('express').Router()
const viewController = require("./viewController")
const categoryController = require('./메ㅑController')

app.use(viewController)
app.use(categoryController)

module.exports = app