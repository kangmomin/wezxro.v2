const path = require("path")

module.exports = (next, app, domain) => {
    app.set('views', path.join(__dirname + '../../../domain/'+ domain +'/view'))
    next()
}