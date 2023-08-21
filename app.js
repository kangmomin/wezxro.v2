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

const accessController = require('./domain/account/controller/accessController')

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
app.set('views', __dirname + '/public')
app.set('view engine', 'ejs')
app.engine('html', require('ejs').renderFile)
app.post('*', bp.urlencoded({ extended: false }))

app.use(accessController)

// public static 파일 설정
app.use(express.static(__dirname + '/public'))

app.get('*', (req, res) => res.render('error', { status: 404, title: "THE PAGE", content: "WAS NOT FOUND" }))
//force : 서버 실행 시 마다 테이블을 재생성 할 것인지 아닌지
sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
    // 테이블 생성
    sequelize.sync().then(() => {
        console.log('DB Sync complete.');
    });
}).catch((error) => {
    console.error('Unable to connect to the database:', error);
});
app.listen(port, () => { console.log(`server is running on ${port}`) })