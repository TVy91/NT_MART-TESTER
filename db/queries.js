// Không dùng database cục bộ nữa, chuyển sang gọi API Backend
// const db = require('./database');

const BACKEND_URL = 'http://localhost:3000/api/query';

const runQuery = async (sql, params = []) => {
    const response = await fetch(`${BACKEND_URL}/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sql, params })
    });
    const data = await response.json();
    if (data.error) throw new Error(data.error);
    return data; // trả về { lastID, changes } giống hệ thống cũ
};

const getQuery = async (sql, params = []) => {
    const response = await fetch(`${BACKEND_URL}/get`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sql, params })
    });
    const data = await response.json();
    if (data.error) throw new Error(data.error);
    return data; // trả về row
};

const allQuery = async (sql, params = []) => {
    const response = await fetch(`${BACKEND_URL}/all`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sql, params })
    });
    const data = await response.json();
    if (data.error) throw new Error(data.error);
    return data; // trả về rows
};

module.exports = { runQuery, getQuery, allQuery };
