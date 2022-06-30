const { verifyJWT } = require("../utils/security");


// Session verification middleware
const verifySession = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    const token = authHeader && authHeader.split(' ')[1]

    var verified = verifyJWT(token, process.env.ACCESS_TOKEN_SECRET)

    if (verified.status) {
        req.savings_id = verified.claims.savings_id
        next()
    } else {
        res.status(401).json({ status: false, message: "A token is required for authentication" })
    }
}

module.exports = verifySession