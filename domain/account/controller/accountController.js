const app = require('express').Router()

const accessRouter = require('./accessController')

app.use(accessRouter)

module.exports = app