const user = require("../controller/auth.controller")

const route = require("express").Router()

route

    .post("/user-register", user.register)
    .post("/user-login", user.login)
    .post("/user-logout", user.logout)


module.exports = route