const isAuthUser = require('../../../global/config/filter/isAuthUser')
const ExceptionHandler = require('../../../global/error/ExceptionHandler')
const accountService = require('../../account/service/accountService')
const dashboardService = require('../service/dashboardService')

const app = require('express').Router()

app.get("/statistics", isAuthUser, async (req, res) => {
    try {
        
        const u = await accountService.info(req)
        const userDetails = await dashboardService.userDetails(req.session.userId)

        res.render(__dirname + "/../view/dashboard", {
            ...u, 
            path: "statistics",
            ...userDetails
        })
    } catch(e) {
        ExceptionHandler(res, e)
    }
})

module.exports = app