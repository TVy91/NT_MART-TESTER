const sqlite3 = require('sqlite3').verbose();
const dbPath = 'ntmart.db';
const db = new sqlite3.Database(dbPath);

const { getQuery, allQuery, runQuery } = require('./db/queries');

async function test() {
    try {
        const cData = [
            {code: 'KH1', name: 'A', phone: '1', address: 'A', note: '', orders: 1, total: '10 đ'},
            {code: 'KH2', name: 'B', phone: '2', address: 'B', note: '', orders: 2, total: '20 đ'}
        ];

        for (const c of cData) {
            await runQuery('INSERT INTO Customers (code, name, phone, address, note, orders, total) VALUES (?,?,?,?,?,?,?)', [c.code, c.name, c.phone, c.address, c.note, c.orders, parseFloat(String(c.total).replace(/[^0-9.-]+/g,"")) || 0]);
        }
        console.log("Customer test OK");
    } catch (e) {
        console.error("Test failed", e);
    }
}
test();
