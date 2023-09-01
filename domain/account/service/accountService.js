const accountRepository = require('../entity/account.js')
const crypto = require('crypto')
const NeedLoginException = require('../exception/NeedLoginException.js')
const UserNotFoundException = require('../exception/UserNotFoundException.js')
const status = require('../../../global/entity/status.js')
const NotEngoughArgsException = require('../../../global/error/exception/NotEnoughArgsException.js')
const StatusDeactiveException = require('../../../global/error/exception/StatusDeactiveException.js')

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
ex.updateMoney = async (money, userId) => {
    await accountRepository.update({money}, {
        where: { userId }
    })
}

/**
 * 
 * @param {String} email 
 * @param {String} password
 */
ex.login = async (email, password) => {
   const account = await accountRepository.findOne({
    where: { email }
   }) 
   if (account === null) throw new UserNotFoundException()

   const encryptedPwd = encrypter(password, account.random)
   
    // 비밀번호 매칭
    if (account.password != encryptedPwd) throw new UserNotFoundException()
    if (account.status == status.deactive) throw new StatusDeactiveException()

    return account.userId
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

ex.updateInfo = async (userId, {name, email, status}) => {
    await accountRepository.update({
        name, email, status
    }, { where: {userId} })
}

ex.updateStatus = async (status, userId) => {
    await accountRepository.update({ status }, { where: { userId } })
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
  