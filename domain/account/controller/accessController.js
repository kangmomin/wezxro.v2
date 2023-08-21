const exceptionHandler = require('../../../global/error/exceptionHandler')
const NotEngoughArgsException = require('../../../global/error/exception/NotEnoughArgsException')
const accountService = require('../service/accountService')
const app = require('express').Router()

app.post("/join", async (req, res, next) => {
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

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body
    
        if (!email || !password) throw new NotEngoughArgsException()
    
        const userId = await accountService.login(email, password)
        req.session.userId = userId
    
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

module.exports = app