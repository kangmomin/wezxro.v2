const renderIsAdmin = require('../../../global/config/filter/renderIsAdmin')
const ExceptionHandler = require('../../../global/error/ExceptionHandler')
const accountService = require('../../account/service/accountService')
const { allService } = require('../../service/service/serviceService')
const { viewCustomRate } = require('../service/customRateService')

const app = require('express').Router()

app.get("/login", (_, res) => res.render("login"))
app.get("/join", (_, res) => res.render("join"))

app.use(isAuthUser)

app.get('/admin/users', renderIsAdmin, async (req, res) => {
    try {
        const user = await accountService.info(req)
        const {users, activeCnt, deactiveCnt} = await accountService.userList()

        res.render('admin/users', {
            ...user,
            path: "users",
            users: users.rows,
            activeCnt,
            deactiveCnt,
            allCnt: users.count
        })
    } catch(e) {
        ExceptionHandler(res, e)
    }
})

app.get("/admin/users/update/:accountId", async (req, res) => {
    try {
        const user = await accountService.infoById(req.params.accountId)

        res.render(__dirname + "/../view/assets/update_account", {
            user,
        })  
    } catch(e) {
        ExceptionHandler(res, e)
    }
})

app.get("/admin/users/add_funds/:userId", async (req, res) => {
    try {
        const user = await accountService.infoById(req.params.userId)

        res.render(__dirname + "/../view/assets/add_fund", {
            user
        })
    } catch(e) {
        ExceptionHandler(res, e)
    }
})

app.get("/admin/users/edit_funds/:userId", async (req, res) => {
    try {
        const user = await accountService.infoById(req.params.userId)

        res.render(__dirname + "/../view/assets/set_balance", {
            user
        })
    } catch(e) {
        ExceptionHandler(res, e)
    }
})

app.get("/admin/users/set_password/:userId", async (req, res) => {
    try {
        const user = await accountService.infoById(req.params.userId)
        
        res.render(__dirname + "/../view/assets/set_password", {
            user
        })
    } catch(e) {
        ExceptionHandler(res, e)
    }
})

app.get("/admin/users/custom_rate/:userId", async (req, res) => {
    try {
        const userId = req.params.userId
        
        const cr = await viewCustomRate(userId)
        const u = await accountService.infoById(userId)
        const services = await allService()

        res.render(__dirname + "/../view/assets/custom_rate", { cr, services, u })
    } catch(e) {
        ExceptionHandler(res, e)
    }
})

app.get("/admin/users/info/:userId", async (req, res) => {
    try {
        const u = await accountService.detail(req.params.userId)

        res.render(__dirname + "/../view/assets/detail", { u })
    } catch(e) {
        ExceptionHandler(res, e)
    }
})

app.get("/admin/users/static_rate/:userId", async (req, res) => {
    try {
        const u = await accountService.detail(req.params.userId)

        res.render(__dirname + "/../view/assets/staticRate", { u })
    } catch(e) {
        ExceptionHandler(res, e)
    }
})

app.get("/logout", async (req, res) => {
    await req.session.destroy()

    res.clearCookie('loginSession');
    res.redirect('/login');
})

module.exports = app