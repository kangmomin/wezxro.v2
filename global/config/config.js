require('dotenv').config();

module.exports = {
  development: {
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    dialect: 'postgres',
    dialectOptions: { // 추가 설정
        charset: 'utf8mb4',
        dateStrings: true,
        typeCast: true,
    },
    timezone: '+09:00',
    pool: {
      max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
  },
};