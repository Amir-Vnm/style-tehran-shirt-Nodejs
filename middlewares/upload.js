

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
