import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import memberRoutes from "./routes/memberRoutes.js";
import exhibitionsRoutes from "./routes/exhibitions/index.js";
import exhibitionsUploadsRoutes from "./routes/exhibitionUploads/index.js"
import couponsRoutes from "./routes/coupons/index.js";
import couponsClaimRoutes from "./routes/couponsClaim/index.js";
import memberCouponsRoutes from "./routes/memberCoupons/index.js";
import couponUploadsRoutes from './routes/couponUploads/index.js'
import exhibitionFavRoutes from "./routes/favorites/exhibitions.js";
import db from "./config/database.js";
import path from "path";
import { fileURLToPath } from "url";
import session from "express-session";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const server = http.createServer(app);

// 中間件
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Content-Type", "Authorization"],
  })
);

// 添加請求日誌中間件
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});


// Session 配置
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-session-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 24 小時
    },
  })
);

// 靜態文件服務
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// 測試數據庫連接的路由
app.get("/api/test-db", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 1 + 1 AS result");
    res.json({
      success: true,
      message: "數據庫連接正常",
      result: rows[0].result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "數據庫連接失敗",
      error: error.message,
    });
  }
});

// 查看資料表結構的路由
app.get("/api/tables", async (req, res) => {
  try {
    const [tables] = await db.query(
      `
      SELECT TABLE_NAME, TABLE_COMMENT 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = ?
    `,
      [process.env.DB_NAME || "museum_db"]
    );

    const tableDetails = await Promise.all(
      tables.map(async (table) => {
        const [columns] = await db.query(
          `
        SELECT COLUMN_NAME, DATA_TYPE, COLUMN_COMMENT, IS_NULLABLE, COLUMN_KEY
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?
      `,
          [process.env.DB_NAME || "museum_db", table.TABLE_NAME]
        );

        return {
          tableName: table.TABLE_NAME,
          comment: table.TABLE_COMMENT,
          columns: columns,
        };
      })
    );

    res.json({
      success: true,
      tables: tableDetails,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "獲取資料表結構失敗",
      error: error.message,
    });
  }
});

// 路由
app.use("/api/members", memberRoutes);
app.use("/api/exhibitions", exhibitionsRoutes);
app.use("/api/exhibitionUploads", exhibitionsUploadsRoutes);
app.use("/api/coupons", couponsRoutes);
app.use("/api/couponsClaim", couponsClaimRoutes);
app.use("/api/memberCoupons", memberCouponsRoutes);
app.use('/api/couponUploads', couponUploadsRoutes)
app.use("/api/favorites/exhibitions", exhibitionFavRoutes);


// 設置端口
const PORT = process.env.PORT || 3005;


server.listen(PORT, () => {
  console.log(`🚀 服務器運行在 http://localhost:${PORT}`);
  console.log("環境變量:", {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    JWT_SECRET: process.env.JWT_SECRET ? "已設置" : "未設置",
  });
});

export default app;
