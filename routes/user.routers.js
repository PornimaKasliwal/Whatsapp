const user = require("../controller/user.controller")

const route = require("express").Router()

route
    .put("/update/:uid", user.updateProfile)
    .get("/search", user.searchUser)

module.exports = route