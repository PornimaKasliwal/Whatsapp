const mongoose = require("mongoose")

module.exports = mongoose.model("user", new mongoose.Schema({
    name: { type: String, required: true },
    mobile: { type: String, required: true },
    photo: { type: String, default: "https://res.cloudinary.com/dka9n7w38/image/upload/v1749805809/dummy_ev5ghv.avif" },
    password: { type: String, required: true },
}, { timestamps: true }))