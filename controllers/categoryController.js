const prisma = require("../db/prisma");

// 📘 دریافت تمام دسته‌بندی‌ها
const getAllCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (error) {
    console.error("❌ خطا در دریافت دسته‌بندی‌ها:", error);
    res.status(500).json({ error: "خطا در دریافت دسته‌بندی‌ها" });
  }
};

// 📗 دریافت یک دسته بر اساس ID
const getCategoryById = async (req, res) => {
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

// 🟢 ایجاد دسته‌بندی
const createCategory = async (req, res) => {
  try {
    const Name = req.body.Name;
    const ImageFile = req.file ? req.file.path : null;

    const newCategory = await prisma.category.create({
      data: { Name, ImageFile },
    });

    res.status(201).json(newCategory);
  } catch (error) {
    console.error("❌ خطا در ساخت دسته‌بندی:", error);
    res.status(500).json({ error: "خطا در ساخت دسته‌بندی" });
  }
};

// 🟠 ویرایش دسته
const updateCategory = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) {
      return res.status(404).json({ error: "دسته‌بندی پیدا نشد" });
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        Name: req.body.Name || category.Name,
        ImageFile: req.file ? req.file.path : category.ImageFile,
      },
    });

    res.json(updatedCategory);
  } catch (error) {
    console.error("❌ خطا در بروزرسانی دسته‌بندی:", error);
    res.status(500).json({ error: "خطا در بروزرسانی دسته‌بندی" });
  }
};

// 🔴 حذف دسته
const deleteCategory = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    await prisma.category.delete({ where: { id } });
    res.json({ message: "✅ دسته‌بندی حذف شد" });
  } catch (error) {
    console.error("❌ خطا در حذف دسته‌بندی:", error);
    res.status(500).json({ error: "خطا در حذف دسته‌بندی" });
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
