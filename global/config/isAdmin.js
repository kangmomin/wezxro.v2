module.exports = async function isAuthUser (req, res, next) {
    if (!req.session.userId || !req.session.isAdmin) res.redirect("/login")

    next()
}