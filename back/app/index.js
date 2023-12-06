const express = require('express');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Works!');
});

// Configuration de la base de données
const database = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
});

database.connect((err) => {
    if(err) {
        console.error('Error connecting to the database :', err);
    } else {
        console.log('Connected to the database');
        app.listen(port, () => {
            console.log(`Server started on port ${port}`);
        });
    }
});

