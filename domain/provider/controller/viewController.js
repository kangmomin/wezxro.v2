const renderIsAdmin = require('../../../global/config/filter/renderIsAdmin')

const app = require('express').Router()

app.get("/admin/provider/update", (req, res) => res.render('assets/addProvider'))
app.get('/admin/provider', renderIsAdmin, (req, res) => res.render('admin/provider'))

module.exports = app