// Không dùng database cục bộ nữa, chuyển sang gọi API Backend
// const db = require('./database');

const BACKEND_URL = 'https://nt-mart-tester-1.onrender.com/api/query';

window.runQuery = async (sql, params = []) => {
    const response = await fetch(`${BACKEND_URL}/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sql, params })
    });
    const data = await response.json();
    if (data.error) throw new Error(data.error);
    return data;
};

window.getQuery = async (sql, params = []) => {
    const response = await fetch(`${BACKEND_URL}/get`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sql, params })
    });
    const data = await response.json();
    if (data.error) throw new Error(data.error);
    return data;
};

window.allQuery = async (sql, params = []) => {
    const response = await fetch(`${BACKEND_URL}/all`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sql, params })
    });
    const data = await response.json();
    if (data.error) throw new Error(data.error);
    return data;
};
