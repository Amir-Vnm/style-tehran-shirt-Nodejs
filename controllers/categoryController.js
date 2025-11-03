// controllers/categoryController.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const fs = require("fs");
const path = require("path");

// 📘 دریافت تمام دسته‌بندی‌ها
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (error) {
    console.error("❌ خطا در دریافت دسته‌بندی‌ها:", error);
    res.status(500).json({ error: "خطا در دریافت دسته‌بندی‌ها" });
  }
};

// 📗 دریافت یک دسته بر اساس ID
exports.getCategoryById = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) {
      return res.status(404).json({ error: "دسته‌بندی پیدا نشد" });
    }
    res.json(category);
  } catch (error) {
    console.error("❌ خطا در دریافت دسته:", error);
    res.status(500).json({ error: "خطا در دریافت دسته" });
  }
};

// 🟢 ایجاد دسته‌بندی جدید
exports.createCategory = async (req, res) => {
  try {
    const Name = req.body.Name;
    const ImageFile = req.file ? `/uploads/${req.file.filename}` : null;

    const newCategory = await prisma.category.create({
      data: { Name, ImageFile },
    });

    res.status(201).json(newCategory);
  } catch (error) {
    console.error("❌ خطا در ساخت دسته‌بندی:", error);
    res.status(500).json({ error: "خطا در ساخت دسته‌بندی" });
  }
};

// 🟠 ویرایش دسته‌بندی (اختیاری ولی آماده)
exports.updateCategory = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) {
      return res.status(404).json({ error: "دسته‌بندی پیدا نشد" });
    }

    let ImageFile = category.ImageFile;

    // اگر عکس جدید فرستاده شد
    if (req.file) {
      // حذف عکس قبلی
      if (category.ImageFile) {
        const oldPath = path.join(__dirname, "..", category.ImageFile.replace(/^\//, ""));
        fs.unlink(oldPath, (err) => {
          if (err) console.warn("⚠️ حذف عکس قبلی با خطا:", err.message);
        });
      }
      ImageFile = `/uploads/${req.file.filename}`;
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        Name: req.body.Name || category.Name,
        ImageFile,
      },
    });

    res.json(updatedCategory);
  } catch (error) {
    console.error("❌ خطا در بروزرسانی دسته‌بندی:", error);
    res.status(500).json({ error: "خطا در بروزرسانی دسته‌بندی" });
  }
};

// 🔴 حذف دسته‌بندی
exports.deleteCategory = async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) {
      return res.status(404).json({ error: "دسته‌بندی پیدا نشد" });
    }

    if (category.ImageFile) {
      const imagePath = path.join(__dirname, "..", category.ImageFile.replace(/^\//, ""));
      try {
        await fs.promises.access(imagePath, fs.constants.F_OK);
        await fs.promises.unlink(imagePath);
        console.log("🗑 عکس حذف شد:", imagePath);
      } catch (fsErr) {
        console.warn("⚠️ فایل عکس وجود ندارد:", fsErr.message);
      }
    }

    await prisma.category.delete({ where: { id } });
    res.json({ message: "✅ دسته‌بندی با موفقیت حذف شد" });
  } catch (error) {
    console.error("❌ خطا در حذف دسته‌بندی:", error);
    res.status(500).json({ error: "خطا در حذف دسته‌بندی" });
  }
};
