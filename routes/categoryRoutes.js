// routes/categoryRoutes.js
const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload"); // اطمینان از وجود middleware آپلود

// 📦 ایمپورت کنترلرها
const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

// 🚀 فقط برای اطمینان هنگام اجرا
console.log("📦 categoryRoutes loaded");

// 📘 گرفتن همه‌ی دسته‌ها
router.get("/", getAllCategories);

// 📗 گرفتن یک دسته خاص بر اساس ID
router.get("/:id", getCategoryById);

// 🟢 ساخت دسته جدید
router.post("/", upload.single("ImageFile"), createCategory);

// 🟠 ویرایش دسته (اختیاری - اگر خواستی فعالش کن)
router.put("/:id", upload.single("ImageFile"), updateCategory);

// 🔴 حذف دسته
router.delete("/:id", deleteCategory);

module.exports = router;
