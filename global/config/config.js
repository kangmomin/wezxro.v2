require('dotenv').config();

module.exports = {
  development: {
    host: process.env.POSTGRES_HOST,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
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