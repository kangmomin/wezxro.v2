require('dotenv').config();

module.exports = {
  development: {
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    dialect: 'mysql',
    dialectOptions: { // 추가 설정
        charset: 'utf8mb4',
        dateStrings: true,
        typeCast: true,
    },
    timezone: '+09:00',
  },
};