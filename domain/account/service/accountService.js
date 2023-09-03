const accountRepository = require('../entity/account.js')
const crypto = require('crypto')
const NeedLoginException = require('../exception/NeedLoginException.js')
const UserNotFoundException = require('../exception/UserNotFoundException.js')
const status = require('../../../global/entity/status.js')
const NotEngoughArgsException = require('../../../global/error/exception/NotEnoughArgsException.js')
const StatusDeactiveException = require('../../../global/error/exception/StatusDeactiveException.js')
const CustomRate = require('../entity/customRate.js')
const Service = require('../../service/entity/service.js')
const getSequelize = require('../../../global/config/getSequelize.js')
const { QueryTypes } = require('sequelize')
const Sequelize = require('../../../global/config/getSequelize.js')()

const ex = module.exports = {}

/**
 * 
 * @param {import('express').Request} req 
 * name     String  사용자 이름
 * depoist  Number  소지금
 * @returns name, depoist
 */
ex.info = async (req) => {
    const userId = req.session.userId || null
    
    if (!userId) throw new NeedLoginException()

    const {name, money} = await accountRepository.findByPk(userId, {
        attributes: ['name', 'money']
    })

    if (name == null) name = "이름을 불러오지 못했습니다."
    
    return { name, money }
}

/**
 * 
 * @param {Number} money 
 * @param {Number} userId 
 */
ex.updateMoney = async (money, userId, adminPwd = null) => {
    if (adminPwd !== null) {
        const admin = await accountRepository.findOne({
            where: { userId }
        })
    
        const result = crypto.createHash('sha512').update(adminPwd + admin.random).digest('base64')
    
        if (admin.password != result) throw new UserNotFoundException()
    }

    await accountRepository.update({money}, {
        where: { userId }
    })
}

/**
 * 
 * @param {String} email 
 * @param {String} password
 */
ex.login = async (email, password, ip) => {
   const account = await accountRepository.findOne({
    where: { email }
   }) 
   if (account === null) throw new UserNotFoundException()

   const encryptedPwd = encrypter(password, account.random)
   
    // 비밀번호 매칭
    if (account.password != encryptedPwd) throw new UserNotFoundException()
    if (account.status == status.deactive) throw new StatusDeactiveException()

    accountRepository.update({ ip }, {
        where: {
            userId: account.userId
        }
    })

    return account
}

/**
 * 
 * @param {String} email 
 * @param {String} name 
 * @param {String} password 
 */
ex.join = async (email, name, password) => {
    // encrypt password
    const random = crypto.randomBytes(10).toString('base64')
    const encryptedPwd = encrypter(password, random)
    
    await accountRepository.create({
        name: name,
        password: encryptedPwd,
        email: email,
        random: random,        
    })
}

ex.userList = async () => {
    const users = await accountRepository.findAndCountAll()

    const activeCnt = users.rows.filter(u => u.status === status.active).length
    const deactiveCnt = users.rows.filter(u => u.status === status.deactive).length

    return {
        activeCnt,
        deactiveCnt,
        users
    }
}

ex.infoById = async (accountId) => {
    if (!accountId) throw new NotEngoughArgsException()

    const user = await accountRepository.findByPk(accountId)
    if (!user) throw new UserNotFoundException()

    return user
}

ex.updateInfo = async (userId, {name, email, reqStatus, pNumber}) => {
    const option = { email }

    if (name) option.name = name
    if (reqStatus in status) option.status = reqStatus
    if (pNumber) option.pNumber = pNumber
    
    await accountRepository.update(option, { where: {userId} })
}

ex.updateStatus = async (status, userId) => {
    await accountRepository.update({ status }, { where: { userId } })
}

ex.setPassword = async (id, password, adminPwd, userId) => {
    if (!id || !password || !userId) throw new NotEngoughArgsException()
    
    const admin = await accountRepository.findOne({
        where: { userId }
    })

    const result = encrypter(adminPwd, admin.random)
    if (admin.password != result) throw new UserNotFoundException()
    
    const random = crypto.randomBytes(10).toString('base64')
    const encryptedPwd = encrypter(password, random)

    await accountRepository.update({
        password: encryptedPwd, random
    }, { where: { userId: id } })
}

ex.delete = async (userId) => {
    if (!userId) throw new NotEngoughArgsException()
    
    await accountRepository.update({
        status: status.deleted
    }, {
        where: { userId }
    })
}

ex.detail = async (userId) => {
    if (!userId) throw new NotEngoughArgsException()

    return await accountRepository.findOne({
        where: { userId },
        attributes: ["userId", "email", "ip", "pNumber", "customRate"]
    })
}

ex.updateStaticRate = async (userId, staticRate = null) => {
    if (!userId) throw new NotEngoughArgsException()

    await accountRepository.update({
        customRate: staticRate
    }, { 
        where: {userId}
    })
}

/**
 * 비밀번호 암호화
 * 
 * @param {string} password 
 * @param {string} random 
 * @returns 
 */
function encrypter(password, random) {
    const result = crypto.createHash('sha512').update(password + random).digest('base64')
    return result
  }
  