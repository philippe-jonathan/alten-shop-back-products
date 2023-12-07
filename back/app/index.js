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
    if (err) {
        console.error('Error connecting to the database :', err);
    } else {
        console.log('Connected to the database');

        // Set session time zone for Europe/Paris
        database.query('SET time_zone = "+01:00"', (err, result) => {
            if (err) {
                console.error('Error setting up time zone:', err);
            } else {
                console.log('Time zone configured successfully');
            }
        });

        app.listen(port, () => {
            console.log(`Server started on port ${port}`);
        });

        // Routes products
        app.get('/products', (req, res) => {
            const sql = 'SELECT * FROM products';

            database.query(sql, (err, result) => {
                if (err) {
                    console.error('SQL query error - Products Recovery Error:', err);
                    return res.status(500).send({ error: 'SQL query error - Products Recovery Error', details: err });
                }

                if (result.length === 0) {
                    return res.status(404).json({ error: 'Products not found.' });
                }

                res.status(200);
                res.json(result);
            });
        });

        app.get('/products/:product_id', (req, res) => {
            const product_id = req.params.product_id;

            // Check if product_id is a valid integer
            if (isNaN(product_id)) {
                return res.status(400).json({ error: 'Invalid product ID.' });
            }

            const sql = 'SELECT * FROM products WHERE id = ?';

            database.query(sql, [product_id], (err, result) => {
                if (err) {
                    console.error('SQL query error - Product Recovery Error :', err);
                    return res.status(500).send({ error: 'SQL query error - Product Recovery Error', details: err });
                }

                if (result.length === 0) {
                    return res.status(404).json({ error: 'Product not found.' });
                }

                const user = result[0];
                res.status(200);
                res.json(user);
            });
        });

        app.post('/products', async (req, res) => {
            const { code, name, description, price, quantity, inventory_status, category_id, image, rating } = req.body;

            if (!code || !name || !description || !price || !quantity || !inventory_status || !category_id) {
                return res.status(400).json({ error: 'Please provide all necessary information.' });
            }

            const sql = 'INSERT INTO products (code, name, description, price, quantity, inventory_status, category_id, image, rating) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
            const values = [code, name, description, price, quantity, inventory_status, category_id, image, rating];

            database.query(sql, values, (err, result) => {
                if (err) {
                    console.error('SQL query error - Error when adding a product :', err);
                    return res.status(500).json({ error: 'SQL query error - Error when adding a product', details: err });
                }

                res.status(201).json({ message: 'Product added successfully!', id: result.insertId });
            });
        });

        app.patch('/products/:product_id', (req, res) => {
            const product_id = req.params.product_id;
            const updates = req.body;

            // Check if product_id is a valid integer
            if (isNaN(product_id)) {
                return res.status(400).json({ error: 'Invalid product ID' });
            }

            // Check if the product exists before updating
            const checkExistenceQuery = 'SELECT * FROM products WHERE id = ?';
            database.query(checkExistenceQuery, [product_id], (err, result) => {
                if (err) {
                    console.error('SQL query error - Error when checking the existence of the product :', err);
                    return res.status(500).send({ error: 'SQL query error - Error when checking the existence of the product', details: err });
                }

                if (result.length === 0) {
                    return res.status(404).json({ error: 'Product not found when verifying its existence' });
                }

                // The product exists, we can update
                const updateQuery = 'UPDATE products SET ? WHERE id = ?';
                database.query(updateQuery, [updates, product_id], (err, updateResult) => {
                    if (err) {
                        console.error('SQL query error - Error when updating the product :', err);
                        return res.status(500).send({ error: 'SQL query error - Error when updating the product', details: err });
                    }

                    res.status(200).json({ message: 'Product updated successfully!' });
                });
            });
        });

        app.delete('/products/:product_id', (req, res) => {
            const product_id = req.params.product_id;

            // Check if product_id is a valid integer
            if (isNaN(product_id)) {
                return res.status(400).json({ error: 'Invalid product ID' });
            }

            // Check if the product exists before deleting
            const checkExistenceQuery = 'SELECT * FROM products WHERE id = ?';
            database.query(checkExistenceQuery, [product_id], (err, result) => {
                if (err) {
                    console.error('SQL query error - Error when checking the existence of the product :', err);
                    return res.status(500).send({ error: 'SQL query error - Error when checking the existence of the product', details: err });
                }

                if (result.length === 0) {
                    return res.status(404).json({ error: 'Product not found when verifying its existence' });
                }

                // The product exists, we can deleted
                const deleteQuery = 'DELETE FROM products WHERE id = ?';
                database.query(deleteQuery, [product_id], (err, deleteResult) => {
                    if (err) {
                        console.error('SQL query error - Error deleting the product :', err);
                        return res.status(500).send('SQL query error - Error deleting the product');
                    }

                    console.log('Product successfully deleted!');
                    res.status(200).json({ message: 'Product successfully deleted!' });
                });
            });
        });



    }
});

