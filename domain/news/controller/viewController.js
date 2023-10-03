const renderIsAdmin = require('../../../global/config/filter/renderIsAdmin')
const ExceptionHandler = require('../../../global/error/ExceptionHandler')
const newsService = require('../service/newsService')

const app = require('express').Router()

app.get("/admin/news", renderIsAdmin, async (req, res) => {
    try {
        const news = await newsService.getNews()

        res.render(__dirname + "/../view/admin/news", {
            path: "news",
            ...news
        })
    } catch(e) {
        ExceptionHandler(res, e)
    }
})

app.get("/admin/news/update", async (req, res) => {
    try {
        res.render(__dirname + "/../view/admin/assets/emptyUpdateNews")
    } catch(e) {
        ExceptionHandler(res, e)
    }
})

app.get("/admin/news/update/:newsId", async (req, res) => {
    try {
        const newsDetail = await newsService.detail(req.params.newsId)
        res.render(__dirname + "/../view/admin/assets/updateNews", {
            n: newsDetail
        })
    } catch(e) {
        ExceptionHandler(res, e)
    }
})

app.get("/admin/news/view/:newsId", async (req, res) => {
    try {
        const newsDetail = await newsService.newses(req.params.newsId)


        res.render(__dirname + "/../view/news", {
            news: newsDetail
        })
    } catch(e) {
        ExceptionHandler(res, e)
    }
})

module.exports = app