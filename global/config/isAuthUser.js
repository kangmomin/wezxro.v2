module.exports = async function isAuthUser (req, res, next) {
    if (!req.session.userId) res.redirect("/login")

    next()
}