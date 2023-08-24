require('dotenv').config();

const { sequelize } = require('./domain');
const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT
const bp = require('body-parser')
const cp = require('cookie-parser')
const session = require('express-session')
const sessionStore = require('express-mysql-session')(session)

const customMiddleware = require('./global/middleware/customViewMiddleware')

const accountRouter = require('./domain/account/controller/router')
const providerRouter = require('./domain/provider/controller/router')
const categoryRouter = require('./domain/category/controller/router')

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
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        }),
        secret: process.env.SESSION_SECRET,
        resave: true,
        saveUninitialized: true,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 7
        }
    }) 
)

// ejs
app.set('view engine', 'ejs')
app.engine('html', require('ejs').renderFile)
app.use('*', bp.urlencoded({ extended: false }))

app.use((_,__,next) => customMiddleware(next, app, "account"))
app.use(accountRouter)

app.use((_,__,next) => customMiddleware(next, app, "provider"))
app.use(providerRouter)

app.use((_,__,next) => customMiddleware(next, app, "category"))
app.use(categoryRouter)


// ================== index 페이지 렌더링 =====================
app.use((_, __, n) => {app.set('views', __dirname + '/global/view'); n()})
app.get('/', (req, res) => res.status(200).render('index', {
    isLogin: req.session.userId !== undefined && req.session.userId !== null
}))
// ================== index 페이지 렌더링 =====================

// public static 파일 설정
app.use(express.static(__dirname + '/public'))

// ================== error 페이지 렌더링 =====================
app.use((_, __, n) => {app.set('views', __dirname + '/global/view'); n()})
app.get('*', (req, res) => res.render('error', { status: 404, title: "THE PAGE", content: "WAS NOT FOUND" }))
// ================== error 페이지 렌더링 =====================


//force : 서버 실행 시 마다 테이블을 재생성 할 것인지 아닌지
sequelize.sync({alter: true}).then(() => {
    console.log('DB Sync complete.');
    app.listen(port, () => { console.log(`server is running on ${port}`) })
})