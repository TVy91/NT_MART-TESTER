const express = require('express');
const cors = require('cors');

// Import trực tiếp database đã có của bạn! (Để giữ nguyên dữ liệu cũ)
const db = require('../db/database.js'); 

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

const path = require('path');

// Phục vụ toàn bộ giao diện Frontend (HTML, CSS, JS) như một trang web
app.use(express.static(path.join(__dirname, '../')));

// ==========================================
// CÁC API THỰC HIỆN CÂU LỆNH SQL QUA HTTP
// ==========================================

// 1. API RUN (Thực hiện INSERT, UPDATE, DELETE)
app.post('/api/query/run', (req, res) => {
    const { sql, params } = req.body;
    db.run(sql, params || [], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ lastID: this.lastID, changes: this.changes });
    });
});

// 2. API GET (Lấy 1 dòng - Dùng cho login, tìm kiếm)
app.post('/api/query/get', (req, res) => {
    const { sql, params } = req.body;
    db.get(sql, params || [], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(row);
    });
});

// 3. API ALL (Lấy nhiều dòng - Dùng cho bảng sản phẩm, khách hàng...)
app.post('/api/query/all', (req, res) => {
    const { sql, params } = req.body;
    db.all(sql, params || [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Backend Server (API) đang chạy tại: http://localhost:${PORT}`);
    console.log(`Đã kết nối thành công với database chính ntmart.db`);
});
