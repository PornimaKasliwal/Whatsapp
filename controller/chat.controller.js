const asyncHandler = require("express-async-handler")
const Chat = require("../model/Chat")
const Message = require("../model/Message")
const { upload } = require("../utils/utils.upload")
const { cloud } = require("../utils/cloud")
const { io } = require("../socket/socket")

exports.createChat = asyncHandler(async (req, res) => {
    const { reciver } = req.body
    const result = await Chat.findOne({
        $and: [
            { users: req.user },
            { users: reciver }
        ]
    })
    if (!result) {
        await Chat.create({ users: [reciver, req.user] })
    }
    res.json({ message: "Chat create success" })
})

exports.contacts = asyncHandler(async (req, res) => {
    const result = await Chat.find({ users: req.user, isGroup: false }).populate("users", "name photo mobile")
    const groupResult = await Chat.find({ users: req.user, isGroup: true }).populate("users", "name photo mobile")
    const data = result.map(item => item.users).flat().filter(item => item._id != req.user)
    res.json({ message: "contact success", result: data, groupResult })
})

exports.sendMessage = asyncHandler(async (req, res) => {
    upload(req, res, async err => {
        if (err) {
            console.log(err);
            return res.status(400).json({ message: "unable to upload" })
        }

        // console.log(req.files)

        const image = (req.files && req.files.image) ? req.files.image[0].path : null
        const video = (req.files && req.files.video) ? req.files.video[0].path : null
        const audio = (req.files && req.files.audio) ? req.files.audio[0].path : null

        let img, vdo, ado

        if (image) {
            const { secure_url } = await cloud.uploader.upload(image)
            img = secure_url
        }

        if (video) {
            const { secure_url } = await cloud.uploader.upload(video, { resource_type: "video", })
            vdo = secure_url
        }

        if (audio) {
            const { secure_url } = await cloud.uploader.upload(audio, { resource_type: "video", })
            ado = secure_url
        }


        const { message, reciver, gif, isGroup } = req.body
        let result
        if (isGroup) {
            result = await Chat.findById(reciver)
        } else {
            result = await Chat.findOne({
                $and: [
                    { users: req.user },
                    { users: reciver }
                ]
            })
        }

        if (!result) {
            return res.status(400).json({ message: "no chat/contact found" })
        }
        await Message.create({
            sender: req.user,
            chat: result._id,
            message,
            gif, image: img,
            video: vdo,
            audio: ado
        })
        io.emit("message", { user: reciver, isGroup })
        res.json({ message: "message send success" })
    })
})

exports.getmessage = asyncHandler(async (req, res) => {
    const { user, isGroup, skip, limit } = req.query
    let result
    if (isGroup) {
        result = await Chat.findById(user)
    } else {
        result = await Chat.findOne({
            $and: [{ users: req.user }, { users: user }]
        })
    }
    const total = await Message.countDocuments()
    const messages = await Message.find({ chat: result._id })
        // .skip(skip)
        // .limit(limit)
        .select("-updateAt -__v -chat")
    res.json({ message: "message fetch success", result: messages, total })
})

exports.createGroup = asyncHandler(async (req, res) => {
    const { users, name } = req.body
    users.push(req.user)
    await Chat.create({ name, users, admin: req.user, isGroup: true })
    res.json({ message: "Group create success" })
})

