const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const { userProtected } = require("./middleware/protected.middleware")
const { app, httpserver } = require("./socket/socket")
require("dotenv").config({})



// const app = express()

app.use(express.json())
app.use(cors({ origin: "http://localhost:5173", credentials: true }))
app.use(cookieParser())


app.use("/api/auth", require("./routes/auth.routes"))
app.use("/api/user", userProtected, require("./routes/user.routers"))
app.use("/api/chat", userProtected, require("./routes/chat.route"))

// app.use("*", (req, res) => {
//     res.status(404).json({ message: "Resource Not Found" })
// })

app.use((err, req, res, next) => {
    console.log(err)
    res.status(500).json({ message: "server error" })
})

mongoose.connect(process.env.MONGO_URL)
mongoose.connection.once("open", () => {
    console.log("db Connected")
    httpserver.listen(process.env.PORT, console.log("server Running....", process.env.PORT))
})