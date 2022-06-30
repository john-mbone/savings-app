const { verifyJWT } = require("../utils/security");


// Session verification middleware
const verifySession = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    const token = authHeader && authHeader.split(' ')[1]

    var verified = verifyJWT(token, '45cf63346b44031d7520fe5940334378154706e64fd5f59a343bfea26ece57a628e9be24e0_sasex15f06df1337c99fb6a20d696de7213124930f8e222331b200e5e7bf6da')

    if (verified.status) {
        req.savings_id = verified.claims.savings_id
        next()
    } else {
        res.status(401).json({ status: false, message: "A token is required for authentication" ,verified})
    }
}

module.exports = verifySession