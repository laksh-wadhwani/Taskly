const bcrypt = require('bcrypt')

const saltRounds = 10

const EncryptPassword = async(password) => {
    return await bcrypt.hash(password, saltRounds)
}

const DecryptPassword = async(password, savedPassword) => {
    return await bcrypt.compare(password, savedPassword)
}

module.exports = {EncryptPassword, DecryptPassword}