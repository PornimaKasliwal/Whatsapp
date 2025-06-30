const mongoose = require("mongoose")


module.exports = mongoose.model("chat", new mongoose.Schema({
    users: [{ type: mongoose.Types.ObjectId, ref: "user" }],
    isGroup: { type: Boolean, default: false },
    name: { type: String },
    photo: { type: String, default: "https://res.cloudinary.com/dka9n7w38/image/upload/v1749805809/dummy_ev5ghv.avif" },
    admin: { type: mongoose.Types.ObjectId, ref: "user" },
}, { timestamps: true }))