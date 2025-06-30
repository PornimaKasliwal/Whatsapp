const express = require("express")
const http = require("http")
const { Server } = require("socket.io")
const app = express()
const httpserver = http.createServer(app)

const io = new Server(httpserver, { cors: { origin: "*" } })

let ONLINE_USERS = []
let TYPING_USERS = []
io.on("connection", (socketData) => {
    console.log("someone joined");
    socketData.on("join", data => {
        if (!ONLINE_USERS.find(item => item._id == data._id)) {
            ONLINE_USERS.push({ ...data, sid: socketData.id })
            io.emit("join-response", ONLINE_USERS)
        }
    })
    socketData.on("typing", data => {
        if (!TYPING_USERS.find(item => item._id == data._id)) {
            TYPING_USERS.push({ ...data, sid: socketData.id })
            io.emit("typing-response", TYPING_USERS)
        }
    })
    socketData.on("no-typing", data => {
        TYPING_USERS = TYPING_USERS.filter(item => item._id !== data._id)
        io.emit("typing-response", TYPING_USERS)
    })
    socketData.on("disconnect", data => {
        ONLINE_USERS = ONLINE_USERS.filter(item => item.sid !== socketData.id)
        io.emit("join-response", ONLINE_USERS)

        TYPING_USERS = TYPING_USERS.filter(item => item.sid !== socketData.id)
        io.emit("join-response", TYPING_USERS)
    })
    // socketData.on("close", data => {
    //     ONLINE_USERS = ONLINE_USERS.filter(item => item._id !== data._id)
    //     io.emit("join-response", ONLINE_USERS)
    // })
})

module.exports = { app, httpserver, io }




/// on => data get karayala
///emit => data post denay sathi
