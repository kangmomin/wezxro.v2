require('dotenv').config();

const { sequelize } = require('./domain');
const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT
const bp = require('body-parser')
const cp = require('cookie-parser')
const session = require('express-session')
const sessionStore = require('connect-session-sequelize')(session.Store)
const path = require('path');

const accountRouter = require('./domain/account/controller/router')
const providerRouter = require('./domain/provider/controller/router')
const categoryRouter = require('./domain/category/controller/router')
const serviceRouter = require('./domain/service/controller/router')
const orderRouter = require('./domain/order/controller/router')
const newsRouter = require('./domain/news/controller/router')
const depoistRouter = require('./domain/depoist/controller/router');
const getSequelize = require('./global/config/getSequelize');
const dashBoardRouter = require('./domain/dashboard/controller/viewController')

app.use(cp())
app.use(cors({
    samesite: true,
    origin: true,
    credentials: true,
    exposedHeaders: ["set-cookie"],
}))

app.use(
    session({
        store: new sessionStore({
            db: getSequelize(),
            checkExpirationInterval: 15 * 60 * 1000,
            expiration: 7 * 24 * 60 * 60 * 1000
        }),
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        proxy: true,
        cookie: {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        }
    })
)

// ejs
app.set('view engine', 'ejs')
app.set('trust proxy', true)
app.engine('html', require('ejs').renderFile)
app.use('*', bp.urlencoded({ extended: false }))

app.use(accountRouter)
app.use(providerRouter)
app.use(categoryRouter)
app.use(newsRouter)
app.use(serviceRouter)
app.use(orderRouter)
app.use(depoistRouter)
app.use(dashBoardRouter)

// ================== index 페이지 렌더링 ===================== 
app.use((_, __, next) => { app.set('views', path.join(__dirname, "/global/view")); next() })
app.get("/admin", (_, res) => res.redirect('/admin/provider'))
app.get('/', (req, res) => res.status(200).render('index.ejs', {
    isLogin: req.session.userId !== undefined && req.session.userId !== null
}))

// app.get("/statistics", (_, res) => res.redirect("/order"))
// ================== index 페이지 렌더링 =====================

// public static 파일 설정
app.use("/public", express.static('public'))

// ================== error 페이지 렌더링 =====================
app.get('*', (req, res) => res.render(__dirname + '/global/view/error.ejs', { status: 404, title: "THE PAGE", content: "WAS NOT FOUND" }))
// ================== error 페이지 렌더링 =====================


//force : 서버 실행 시 마다 테이블을 재생성 할 것인지 아닌지
sequelize.sync({alter:false}).then(() => {
    console.log('DB Sync complete.');
    app.listen(port, () => { console.log(`server is running on ${port || 3000}`) })
})