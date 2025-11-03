 {/*  // server.js
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");

// فعال‌سازی CORS برای ارتباط فرانت
app.use(cors());

// برای JSON
app.use(express.json());

// مسیر استاتیک برای نمایش عکس‌ها
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// روت دسته‌بندی‌ها
const categoryRoutes = require("./routes/categoryRoutes");
app.use("/api/categories", categoryRoutes);

// روت محصولات
const productRoutes = require("./routes/productRoutes");
app.use("/api/products", productRoutes);

// هندل خطای 404
app.use((req, res) => {
  res.status(404).json({ error: "مسیر یافت نشد" });
});

// اجرای سرور
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀🚀🚀🚀🚀🚀🚀🚀 Server running on http://localhost:${PORT} 🚀🚀🚀`);
});
*/}


// server.js
require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");

// فعال‌سازی CORS برای ارتباط فرانت
app.use(cors());

// برای JSON
app.use(express.json());

// اگر خواستی همچنان فایل‌های محلی سرو کنی (اختیاری)، این خط رو نگه دار
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// روت دسته‌بندی‌ها
const categoryRoutes = require("./routes/categoryRoutes");
app.use("/api/categories", categoryRoutes);

// روت محصولات
const productRoutes = require("./routes/productRoutes");
app.use("/api/products", productRoutes);

// هندل خطای 404
app.use((req, res) => {
  res.status(404).json({ error: "مسیر یافت نشد" });
});

// اجرای سرور
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀🚀🚀🚀🚀🚀🚀 Server running on http://localhost:${PORT}`);
});
