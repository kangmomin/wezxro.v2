const isAuthUser = require('../../../global/config/filter/isAuthUser')
const renderIsAdmin = require('../../../global/config/filter/renderIsAdmin')
const ExceptionHandler = require('../../../global/error/ExceptionHandler')
const accountService = require('../../account/service/accountService')
const { checkUnread }  = require('../../news/service/newsService')
const dashboardService = require('../service/dashboardService')

const app = require('express').Router()

app.get("/statistics", isAuthUser, async (req, res) => {
    try {
        
        const u = await accountService.info(req)
        const userDetails = await dashboardService.userDetails(req.session.userId)
        const isUnread = await checkUnread()

        res.render(__dirname + "/../view/dashboard", {
            ...u, 
            path: "statistics",
            ...userDetails,
            
        })
    } catch(e) {
        ExceptionHandler(res, e)
    }
})

app.get("/admin/statistics", renderIsAdmin, async (req, res) => {
    try {
        
        const u = await accountService.info(req)
        const dashboardData = await dashboardService.adminDashboard(req.session.userId)

        res.render(__dirname + "/../view/admin/dashboard", {
            ...u, 
            path: "statistics",
            ...dashboardData
        })
    } catch(e) {
        ExceptionHandler(res, e)
    }
})

module.exports = app