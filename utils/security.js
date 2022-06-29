const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')

exports.hashPassword = async function (password) {
    const salt = await bcrypt.genSalt(12);
    const hashed = await bcrypt.hash(password, salt);
    return hashed
}

exports.comparePassword = async function (password, hash) {
    const validPassword = await bcrypt.compare(password, hash);

    return validPassword
}


exports.generateAccessToken = function (claims, expiresIn) {
    const accessToken = jwt.sign(claims, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn
    })

    return accessToken
}

exports.generateRefreshToken = function (claims) {
    const refreshToken = jwt.sign(claims, process.env.REFRESH_TOKEN_SECRET)

    return refreshToken
}

exports.verifyJWT = function (token, secret) {
    var verify = {}
    jwt.verify(token, secret, (err, claims) => {
        if (err) verify = {
            status: false,
            statusCode: 401
        }
        else verify = {
            status: true,
            claims
        }
    })

    return verify
}
