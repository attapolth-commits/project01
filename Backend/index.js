const express = require('express');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = 8000;
const cors = require('cors');

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../Frontend')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/login.html'));
});

let conn;

const initMySQL = async () => {
    if (!conn) {
        conn = await mysql.createConnection({
            host:'localhost',
            user:'root',
            password:'root',
            database:'webdb',
            port:8700
        });
        console.log('connect to database');
    }
    return conn;
}

app.post('/login', async (req, res) => {
    try {
        const db = await initMySQL();
        const { user, password } = req.body;
        const [rows] = await db.query(
            'SELECT * FROM users WHERE user = ? AND password = ?', [user, password]
        );

        if (rows.length > 0) {
            res.json({
                status: "ok",
                message: "login success"
            });
        } else {
            res.json({
                status: "error",
                message: "user or password incorrect"
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: "Server error" });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});