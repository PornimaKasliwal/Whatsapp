const asyncHandler = require("express-async-handler")
const User = require("../model/User")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")


const register = asyncHandler(async (req, res) => {
    const { mobile, password } = req.body
    const result = await User.findOne({ mobile })

    if (result) {
        return res.status(401).json({ message: "mobile aready exist" })
    }

    const hash = await bcrypt.hash(password, 10)
    await User.create({ ...req.body, password: hash })
    res.json({ message: "user register success" })
})

const login = asyncHandler(async (req, res) => {
    const { mobile, password } = req.body
    const result = await User.findOne({ mobile })

    if (!result) {
        return res.status(401).json({ message: "mobile does not exist" })
    }

    const isValid = await bcrypt.compare(password, result.password)
    if (!isValid) {
        return res.status(401).json({ message: "invalid credentials" })
    }

    const token = jwt.sign({ _id: result._id }, process.env.JWT_KEY, { expiresIn: "7d" })

    res.cookie("USER", token, { maxAge: 1000 * 60 * 60 * 24 * 7, httpOnly: true, secure: process.env.NODE_ENV === "dev" ? false : true })
    res.json({
        message: "user login success", result: {
            _id: result._id,
            name: result.name,
            photo: result.photo,
            mobile: result.mobile,
        }
    })
})

const logout = asyncHandler(async (req, res) => {
    res.clearCookie("USER")
    res.json({ message: "user Logout Success" })
})

module.exports = { register, login, logout }
