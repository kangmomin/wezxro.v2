const isAdmin = require('../../../global/config/filter/isAdmin')
const ExceptionHandler = require('../../../global/error/ExceptionHandler')
const NotEngoughArgsException = require('../../../global/error/exception/NotEnoughArgsException')
const { addCategory, deleteCategory, updateSort } = require('../service/adminCategoryService')

const app = require('express').Router()

app.post('/admin/category/store', isAdmin, async (req, res) => {
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

app.post("/admin/category/delete/:categoryId", isAdmin, async (req, res) => {
    const categoryId = req.params.categoryId || null
    
    try {
        await deleteCategory(categoryId)

        res.send(JSON.stringify({
            message: "카테고리를 삭제하였습니다.",
            status: "success"
        }))
    } catch(e) {
        ExceptionHandler(res, e)
    }
})

app.post("/admin/category/change_sort/:categoryId", async (req, res) => {
    try {
        const { sort } = req.body
        await updateSort(req.params.categoryId, sort)

        res.send(JSON.stringify({
            message: "카테고리의 sort를 수정하였습니다.",
            status: "success"
        }))
    } catch(e) {
        ExceptionHandler(res, e)
    }
})

app.post("/admin/category/change_status/:categoryId", async (req, res) => {
    try {
        const { status } = req.body
        await updateSort(req.params.categoryId, status)

        res.send(JSON.stringify({
            message: "카테고리의 status를 수정하였습니다.",
            status: "success"
        }))
    } catch(e) {
        ExceptionHandler(res, e)
    }
})

module.exports = app    