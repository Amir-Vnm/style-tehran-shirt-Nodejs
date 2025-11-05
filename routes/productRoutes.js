
// routes/productRoutes.js
const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload"); // توجه: middlewares با s
const productController = require("../controllers/productController");

// گرفتن همه محصولات (یا با ?category=)
router.get("/", productController.getAllProducts);

// گرفتن محصولات بر اساس category param (در صورت نیاز)
router.get("/by-category/:categoryId", productController.getProductsByCategory);

// گرفتن محصول خاص
router.get("/:id", productController.getProductById);

// ساخت محصول جدید (عکس آپلود روی Cloudinary و URL داخل DB ذخیره میشه)
router.post("/", upload.single("ImageFile"), productController.createProduct);

// ویرایش محصول (در صورت وجود عکس جدید، فایل جدید آپلود و تصویر قبلی حذف میشه)
router.put("/:id", upload.single("ImageFile"), productController.updateProduct);

// حذف محصول (در صورت وجود، تصویر از Cloudinary حذف میشه)
router.delete("/:id", productController.deleteProduct);

module.exports = router;
//