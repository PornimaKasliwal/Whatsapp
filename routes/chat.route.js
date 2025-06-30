const chat = require("../controller/chat.controller")

const route = require("express").Router()

route
    .post("/create-chat", chat.createChat)
    .get("/contacts", chat.contacts)
    .post("/send-message", chat.sendMessage)
    .get("/get-message", chat.getmessage)
    .post("/create-group", chat.createGroup)

module.exports = route