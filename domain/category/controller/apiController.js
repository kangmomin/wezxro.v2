const ExceptionHandler = require('../../../global/error/ExceptionHandler')
const NotEngoughArgsException = require('../../../global/error/exception/NotEnoughArgsException')
const { addCategory } = require('../service/adminCategoryService')

const app = require('express').Router()

app.post('/admin/category/store', async (req, res) => {
    let { id, name, sort, status } = req.body

    try {
        if (!name || !sort || !status || sort < 1) throw new NotEngoughArgsException()

        await addCategory({ id, name, sort, status })

        res.send(JSON.stringify({ 
            message: "카테고리 등록에 성공하였습니다.", 
            data: id, 
            status: "success" 
        }))
    } catch (e) {
        ExceptionHandler(res, e)
    }
})

module.exports = app