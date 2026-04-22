const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(__dirname, '..', 'ntmart.db');

const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    // Tạo bảng Users
    db.run(`CREATE TABLE IF NOT EXISTS Users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        role TEXT
    )`);

    // Tạo bảng Customers
    db.run(`CREATE TABLE IF NOT EXISTS Customers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code TEXT UNIQUE,
        name TEXT,
        phone TEXT,
        address TEXT,
        note TEXT,
        orders INTEGER DEFAULT 0,
        total REAL DEFAULT 0
    )`);

        // Tạo bảng Suppliers
        db.run(`CREATE TABLE IF NOT EXISTS Suppliers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            code TEXT UNIQUE,
            name TEXT,
            contact TEXT,
            phone TEXT,
            address TEXT
        )`);

        // Tạo bảng Products
        db.run(`CREATE TABLE IF NOT EXISTS Products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            code TEXT UNIQUE,
            name TEXT,
            unit TEXT,
            priceStr TEXT,
            priceRaw REAL,
            importPrice REAL,
            stock INTEGER DEFAULT 0,
            status TEXT,
            expiryDate TEXT
        )`);

        // Migration: Add markupPercent column if it doesn't exist
        db.run(`ALTER TABLE Products ADD COLUMN markupPercent REAL DEFAULT 0`, (err) => {
            if (err) {
                // Ignore error if column already exists
                if (!err.message.includes('duplicate column name')) {
                    console.log('Migration info:', err.message);
                }
            }
        });

        // Tạo bảng Transactions (Sales & Imports)
        db.run(`CREATE TABLE IF NOT EXISTS Transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            code TEXT UNIQUE,
            type TEXT, -- 'SALE' | 'IMPORT'
            date TEXT,
            entityCode TEXT,
            entityName TEXT,
            phone TEXT,
            address TEXT,
            itemsCount INTEGER,
            totalStr TEXT,
            totalRaw REAL,
            itemsStr TEXT
        )`);

        // Tạo bảng Transaction Details
        db.run(`CREATE TABLE IF NOT EXISTS TransactionDetails (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            transactionCode TEXT,
            productCode TEXT,
            productName TEXT,
            unit TEXT,
            qty INTEGER,
            price REAL,
            importPrice REAL,
            total REAL
        )`);

    // Tạo tài khoản mặc định nếu chưa có
    db.get('SELECT count(*) as count FROM Users', [], (err, row) => {
        if (row && row.count === 0) {
            db.run(`INSERT INTO Users (username, password, role) VALUES ('NT_Mart123', 'NT_Mart123', 'admin')`);
        }
    });
});

module.exports = db;
