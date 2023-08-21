const app = require('express').Router()

app.get("/login", (_, res) => res.render("login"))
app.get("/join", (_, res) => res.render("join"))

module.exports = app