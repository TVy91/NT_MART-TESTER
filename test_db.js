const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('ntmart.db');

db.all('SELECT * FROM Customers', [], (err, rows) => {
    if (err) console.error(err);
    else console.log('Customers count:', rows.length);
});
db.all('SELECT * FROM Products', [], (err, rows) => {
    if (err) console.error(err);
    else console.log('Products count:', rows.length);
});
