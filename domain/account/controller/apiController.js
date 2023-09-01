const ExceptionHandler = require('../../../global/error/ExceptionHandler')
const exceptionHandler = require('../../../global/error/ExceptionHandler')
const NotEngoughArgsException = require('../../../global/error/exception/NotEnoughArgsException')
const accountService = require('../service/accountService')
const app = require('express').Router()

app.post("/ajax_sign_up", async (req, res) => {
    try {
        const { password, email, first_name } = req.body
    
        if (email == undefined || email == null ||
            password == undefined || password == null) {
            throw new NotEngoughArgsException()
        }
    
        await accountService.join(email, first_name, password)
    
        res.send(JSON.stringify({
            status: "success",
            message: "회원가입 완료",
        }))
    } catch(e) {
        exceptionHandler(res, e)
    }
})

app.post("/ajax_sign_in", async (req, res) => {
    try {
        const { email, password } = req.body
    
        if (!email || !password) throw new NotEngoughArgsException()
    
        const userId = await accountService.login(email, password)
        req.session.userId = userId
        req.session.isAdmin = email == `admin@${process.env.EN_NAME.toLocaleLowerCase()}.com`
    
        res.cookie("sessionID", req.sessionID, { httpOnly: true, secure: false, maxAge: 600000 })
        res.setHeader('Content-Type', 'text/html; charset=utf-8')
        res.send(JSON.stringify({
            message: "로그인 성공",
            status: "success"
        }))
    } catch(e) {
        exceptionHandler(res, e)
    }
})

app.post('/logout', async (req, res) => {
    await req.session.destroy()

    res.clearCookie('loginSession');
    res.redirect('/login');
})

app.post("/admin/users/store/", async (req, res) => {
    try {
        const {
            ids,
            name,
            email,
            status
        } = req.body

        await accountService.updateInfo(ids, {name, email, status})

        res.send(JSON.stringify({
            message: "유저 정보 수정을 완료했습니다.",
            status: "success"
        }))
    } catch(e) {
        ExceptionHandler(res, e)
    }
})

app.post("/admin/users/change_status/:userId", async (req, res) => {
    try {
        const { status } = req.body
        const userId = req.params.userId

        if (!userId || status === undefined || status === null) throw new NotEngoughArgsException()

        await accountService.updateStatus(status, userId)

        res.send(JSON.stringify({
            message: "status를 업데이트 했습니다.",
            status: "success"
        }))
    } catch(e) {
        ExceptionHandler(res, e)
    }
})

app.post("/admin/users/edit_funds/", async (req, res) => {
    try {
        const { ids, new_balance, secret_key } = req.body

        if (!ids || new_balance === undefined || new_balance === null) throw new NotEngoughArgsException()
        if (!secret_key) throw new NotEngoughArgsException()

        await accountService.updateMoney(new_balance, ids, secret_key)

        res.send(JSON.stringify({
            message: `보유액을 ${new_balance}원으로 변경 했습니다.`,
            status: "success"
        }))
    } catch(e) {
        ExceptionHandler(res, e)
    }
})

module.exports = app