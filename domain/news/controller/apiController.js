const { async } = require('fast-glob')
const isAdmin = require('../../../global/config/filter/isAdmin')
const ExceptionHandler = require('../../../global/error/ExceptionHandler')
const newsService = require('../service/newsService')

const app = require('express').Router()

app.post("/admin/news/store/", isAdmin, async (req, res) => {
    try {
        await newsService.addNews(req.body)

        res.send(JSON.stringify({
            message: "공지가 등록되었습니다.",
            status: "success"
        }))
    } catch(e) {
        ExceptionHandler(res, e)
    }
})

app.post("/admin/news/delete/:newsId", isAdmin, async (req, res) => {
    try {
        await newsService.delete(req.params.newsId)
        
        res.send(JSON.stringify({
            message: "공지가 삭제되었습니다.",
            status: "success"
        }))
    } catch(e) {
        ExceptionHandler(res, e)
    }

})

module.exports = app