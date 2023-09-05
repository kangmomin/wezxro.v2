const isAdmin = require('../../../global/config/filter/isAdmin')
const ExceptionHandler = require('../../../global/error/ExceptionHandler')
const exceptionHandler = require('../../../global/error/ExceptionHandler')
const NotEngoughArgsException = require('../../../global/error/exception/NotEnoughArgsException')
const accountService = require('../service/accountService')
const customRateService = require('../service/customRateService')
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
    
        const user = await accountService.login(email, password, req.ip)
        req.session.userId = undefined
        req.session.isAdmin = undefined
        req.session.rate = undefined
        
        req.session.userId = user.userId
        req.session.isAdmin = email == `admin@${process.env.EN_NAME.toLocaleLowerCase()}.com`
        req.session.rate = user.customRate
    
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

app.get("/demo-login", async (req, res) => {
    try {
        const user = await accountService.login(`demo@${process.env.EN_NAME.toLowerCase()}.com`, "demoPassword", req.ip)
        req.session.userId = undefined
        req.session.isAdmin = undefined
        req.session.rate = undefined
        
        req.session.userId = user.userId
        req.session.isAdmin = false
    
        res.cookie("sessionID", req.sessionID, { httpOnly: true, secure: false, maxAge: 60000 })
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

app.post("/admin/users/store/", isAdmin, async (req, res) => {
    try {
        const {
            ids,
            name,
            email,
            status,
            pNumber,
        } = req.body

        await accountService.updateInfo(ids, {name, email, status, pNumber})

        res.send(JSON.stringify({
            message: "유저 정보 수정을 완료했습니다.",
            status: "success"
        }))
    } catch(e) {
        ExceptionHandler(res, e)
    }
})

app.post("/admin/users/change_status/:userId", isAdmin, async (req, res) => {
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

app.post("/admin/users/edit_funds/", isAdmin, async (req, res) => {
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

app.post('/admin/users/set_password_process', isAdmin, async (req, res) => {
    try {
        const {password, secret_key, ids} = req.body

        await accountService.setPassword(ids, password, secret_key, req.session.userId)

        res.send(JSON.stringify({
            message: "비밀번호를 재설정하였습니다.",
            status: "success"
        }))
    } catch(e) {
        ExceptionHandler(res, e)
    }
})

app.post("/admin/users/view_user/:targetId", isAdmin, (req, res) => {
    try {
        const targetId = req.params.targetId
        if (!targetId) throw new NotEngoughArgsException()
        req.session.userId = targetId
        req.session.isAdmin = false

        res.cookie("sessionID", req.sessionID, { httpOnly: true, secure: false, maxAge: 600000 })
        res.send(JSON.stringify({
            message: "로그인 정보 수정 완료.",
            status: "success"
        }))
    } catch(e) {
        ExceptionHandler(res, e)
    }
})

app.post("/admin/users/delete/:userId", isAdmin, async (req, res) => {
    try {
        await accountService.delete(req.params.userId)

        res.send(JSON.stringify({
            message: "유저를 삭제하였습니다.",
            status: "success"            
        }))
    } catch(e) {
        ExceptionHandler(res, e)
    }
})

app.post('/admin/users/form_custom_rates', isAdmin, async (req, res) => {
    try {
        const { ids } = req.body
        const cr = parseCustomRates(req.body)

        // customRateId가 없으면 add 있으면 delete
        
        for (id in cr) {
            if (cr[id].uid == "") 
                await customRateService.add(ids, cr[id])
            
        }

        await customRateService.deleteRate(Object.keys(cr), ids)
        
        res.send(JSON.stringify({
            message: "개별 가격을 적용하였습니다.",
            status: "success"
        }))
    } catch(e) {
        ExceptionHandler(res, e)
    }
})

app.post('/admin/users/staticRate/', isAdmin, async (req, res) => {
    try {
        const { ids, staticRate } = req.body
        
        await accountService.updateStaticRate(ids, staticRate)
        res.send(JSON.stringify({
            message: "전체 감가액을 설정하였습니다.",
            status: "success"
        }))
    } catch(e) {
        ExceptionHandler(res, e)
    }
})

function parseCustomRates(reqBody) {
    const customRate = {};
    for (let key in reqBody) {
        // 정규표현식을 사용하여 키에서 인덱스와 프로퍼티 이름 추출
        const match = key.match(/customRates\[(\d+)\]\[(\w+)\]/);
        if (match) {
            const index = match[1];  // 문자열로 처리
            const property = match[2];

            // 객체에 해당 인덱스의 객체가 없으면 새 객체를 추가
            if (!customRate[index]) {
                customRate[index] = {};
            }

            // 해당 프로퍼티에 값을 설정
            customRate[index][property] = reqBody[key];
        }
    }
    return customRate;
}


module.exports = app