const multer = require("multer")


const photoUpload = multer({ storage: multer.diskStorage({}) }).single("photo")
const upload = multer({ storage: multer.diskStorage({}) }).fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
    { name: "audio", maxCount: 1 },
])
// const ImageUpload = multer({ storage: multer.diskStorage({}) }).array("photo", 5)
// const AudioUpload = multer({ storage: multer.diskStorage({}) }).array("photo", 5)
// const VideoUpload = multer({ storage: multer.diskStorage({}) }).array("photo", 5)


module.exports = { photoUpload, upload }