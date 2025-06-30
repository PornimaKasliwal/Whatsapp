const jwt = require("jsonwebtoken")
const userProtected = async (req, res, next) => {
    const USER = req.cookies.USER
    if (!USER) {
        return res.status(401).json({ message: "no cookie found" })
    }

    jwt.verify(USER, process.env.JWT_KEY, (err, decode) => {
        if (err) {
            console.log(err)
            return res.status(401).json({ message: "invalid token" })
        }
        // console.log(decode)
        req.user = decode._id
        next()
    })
}

module.exports = { userProtected }