{/*const multer = require("multer");
const path = require("path");
const fs = require("fs");

// مسیر ذخیره عکس‌ها
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "..", "uploads");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + path.extname(file.originalname);
    cb(null, uniqueSuffix);
  },
});

const upload = multer({ storage });
module.exports = upload;
*/}

// middlewares/upload.js
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_URL ? process.env.CLOUDINARY_URL.split("@")[1] : process.env.CLOUDINARY_CLOUD_NAME,
  // but using CLOUDINARY_URL is enough for cloudinary lib automatically too
  // we still pass nothing forced; cloudinary lib reads CLOUDINARY_URL automatically
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "products",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 1200, crop: "limit" }],
  },
});

const upload = multer({ storage });

module.exports = upload;
