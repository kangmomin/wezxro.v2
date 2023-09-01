const ExceptionHandler = require('../../../global/error/ExceptionHandler')
const accountService = require('../../account/service/accountService')

const app = require('express').Router()

app.get("/login", (_, res) => res.render("login"))
app.get("/join", (_, res) => res.render("join"))

app.get('/admin/users', async (req, res) => {
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

        res.render("assets/update_account", {
            user,
        })  
    } catch(e) {
        ExceptionHandler(res, e)
    }
})

app.get("/admin/users/add_funds/:userId", async (req, res) => {
    try {
        const user = await accountService.infoById(req.params.userId)

        res.render("assets/add_fund", {
            user
        })
    } catch(e) {
        ExceptionHandler(res, e)
    }
})

app.get("/admin/users/edit_funds/:userId", async (req, res) => {
    try {
        const user = await accountService.infoById(req.params.userId)

        res.render("assets/set_balance", {
            user
        })
    } catch(e) {
        ExceptionHandler(res, e)
    }
})

module.exports = app