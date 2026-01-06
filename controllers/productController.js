// controllers/productController.js

const prisma = require("../db/prisma"); // ✅ CommonJS
const fs = require("fs");
const path = require("path");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

if (process.env.CLOUDINARY_URL) {
  // cloudinary lib خودش CLOUDINARY_URL رو می‌خونه
  cloudinary.config({ secure: true });
}

// helper: استخراج public_id از URL کلودینری
function getCloudinaryPublicIdFromUrl(url) {
  if (!url) return null;
  const m = url.match(/\/upload\/(?:v\d+\/)?(.+)\.(jpg|jpeg|png|webp|gif)$/i);
  return m ? m[1] : null;
}

// 📘 گرفتن همه محصولات (یا فیلتر بر اساس category)
const getAllProducts = async (req, res) => {
  try {
    const { category } = req.query;
    let products;

    if (category) {
      products = await prisma.product.findMany({
        where: { CategoryId: parseInt(category) },
        include: { Category: true },
      });
    } else {
      products = await prisma.product.findMany({
        include: { Category: true },
      });
    }

    res.json(products);
  } catch (error) {
    console.error("❌ خطا در دریافت محصولات:", error);
    res.status(500).json({ error: "خطا در دریافت محصولات" });
  }
};

// 📗 گرفتن محصولات بر اساس categoryId
const getProductsByCategory = async (req, res) => {
  const { categoryId } = req.params;
  try {
    const products = await prisma.product.findMany({
      where: { CategoryId: parseInt(categoryId) },
      include: { Category: true },
    });
    res.json(products);
  } catch (error) {
    console.error("❌ خطا در گرفتن محصولات دسته‌بندی:", error);
    res.status(500).json({ error: "خطا در دریافت محصولات دسته‌بندی" });
  }
};

// 📙 گرفتن محصول با ID
const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: { Category: true },
    });

    if (!product) {
      return res.status(404).json({ error: "محصول پیدا نشد" });
    }

    res.json(product);
  } catch (error) {
    console.error("❌ خطا در دریافت محصول:", error);
    res.status(500).json({ error: "خطا در دریافت محصول" });
  }
};

// 🟢 ایجاد محصول
const createProduct = async (req, res) => {
  try {
    const { Price, Description, Inventory, CategoryId } = req.body;

    const ImageFile =
      (req.file && (req.file.path || req.file.url || req.file.secure_url)) || null;

    const newProduct = await prisma.product.create({
      data: {
        ImageFile,
        Price: parseFloat(Price),
        Description,
        Inventory: parseInt(Inventory),
        CategoryId: parseInt(CategoryId),
      },
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error("❌ خطا در ایجاد محصول:", error);
    res.status(500).json({ error: "خطا در ساخت محصول" });
  }
};

// 🟠 آپدیت محصول
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { Price, Description, Inventory, CategoryId } = req.body;

  try {
    const existingProduct = await prisma.product.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingProduct) {
      return res.status(404).json({ error: "محصول پیدا نشد" });
    }

    let ImageFile = existingProduct.ImageFile;

    if (req.file) {
      if (ImageFile) {
        const publicId = getCloudinaryPublicIdFromUrl(ImageFile);
        if (publicId) {
          try {
            await cloudinary.uploader.destroy(publicId);
          } catch (err) {
            console.warn("⚠️ خطا در حذف تصویر قدیمی:", err.message);
          }
        }
      }

      ImageFile =
        (req.file && (req.file.path || req.file.url || req.file.secure_url)) ||
        ImageFile;
    }

    const updated = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        ImageFile,
        Price: parseFloat(Price),
        Description,
        Inventory: parseInt(Inventory),
        CategoryId: parseInt(CategoryId),
      },
    });

    res.json(updated);
  } catch (error) {
    console.error("❌ خطا در آپدیت محصول:", error);
    res.status(500).json({ error: "خطا در ویرایش محصول" });
  }
};

// 🔴 حذف محصول
const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const existingProduct = await prisma.product.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingProduct) {
      return res.status(404).json({ error: "محصول پیدا نشد" });
    }

    if (existingProduct.ImageFile) {
      const publicId = getCloudinaryPublicIdFromUrl(existingProduct.ImageFile);
      if (publicId) {
        try {
          await cloudinary.uploader.destroy(publicId);
        } catch (err) {
          console.warn("⚠️ خطا در حذف عکس از Cloudinary:", err.message);
        }
      }
    }

    await prisma.product.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: "✅ محصول حذف شد" });
  } catch (error) {
    console.error("❌ خطا در حذف محصول:", error);
    res.status(500).json({ error: "خطا در حذف محصول" });
  }
};

// ✅ خروجی CommonJS
module.exports = {
  getAllProducts,
  getProductsByCategory,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
