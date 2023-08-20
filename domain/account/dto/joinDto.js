class JoinDto {
    constructor(encryptedPwd, email, random, first_name, checkKey) {
        this.encryptedPwd =  encryptedPwd
        this.email = email
        this.random = random
        this.first_name = first_name
        this.checkKey = checkKey
    }
}

module.exports = JoinDto