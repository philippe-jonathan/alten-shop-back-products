const db = require('../config/db_connection');

const product_controller = {


    get_all_products: async (req, res) => {
        try {
            const sql = 'SELECT * FROM products';
            const [rows, fields] = await db.promise().query(sql);

            if (rows.length === 0) {
                return res.status(404).json({ error: 'Products not found' });
            }

            res.status(200).json(rows);
        } catch (error) {
            console.error('(get_all_products) SQL query error - Products Recovery Error :', error);
            res.status(500).send('SQL query error - Products Recovery Error');
        }
    },

    get_product_by_id: async (req, res) => {
        const product_id = req.params.product_id;

        // Check if product_id is a valid integer
        if (isNaN(product_id)) {
            return res.status(400).json({ error: 'Invalid product ID' });
        }

        try {
            const sql = 'SELECT * FROM products WHERE id = ?';
            const [rows, fields] = await db.promise().query(sql, [product_id]);

            if (rows.length === 0) {
                return res.status(404).json({ error: 'Product not found' });
            }

            const product = rows[0];
            res.status(200).json(product);
        } catch (error) {
            console.error('(get_product_by_id) SQL query error - Product Recovery Error :', error);
            res.status(500).json({ error: 'SQL query error - Product Recovery Error', details: error });
        }
    },

    create_product: async (req, res) => {
        const { code, name, description, price, quantity, inventory_status, category_id, image, rating } = req.body;

        if (!code || !name || !description || !price || !quantity || !inventory_status || !category_id) {
            return res.status(400).json({ error: 'Please provide all necessary information' });
        }

        try {
            const sql = 'INSERT INTO products (code, name, description, price, quantity, inventory_status, category_id, image, rating) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
            const values = [code, name, description, price, quantity, inventory_status, category_id, image, rating];

            const [result] = await db.promise().query(sql, values);

            console.log('Product added successfully!');
            res.status(201).json({ message: 'Product added successfully!', id: result.insertId });
        } catch (error) {
            console.error('(create_product) SQL query error - Error when adding a product', error);
            res.status(500).json({ error: 'SQL query error - Error when adding a product', details: error });
        }
    },

    update_product: async (req, res) => {
        const product_id = req.params.product_id;
        const updates = req.body;

        // Check if product_id is a valid integer
        if (isNaN(product_id)) {
            return res.status(400).json({ error: 'Invalid product ID' });
        }

        try {
            // Check if the product exists before updating
            const checkExistenceQuery = 'SELECT * FROM products WHERE id = ?';
            const [existenceResult] = await db.promise().query(checkExistenceQuery, [product_id]);

            if (existenceResult.length === 0) {
                return res.status(404).json({ error: 'Product not found when verifying its existence' });
            }

            // The product exists, we can update
            const updateQuery = 'UPDATE products SET ? WHERE id = ?';
            await db.promise().query(updateQuery, [updates, product_id]);

            console.log('Product updated successfully!');
            res.status(200).json({ message: 'Product updated successfully!' });
        } catch (error) {
            console.error('(update_product) SQL query error - Error when updating the product :', error);
            res.status(500).json({ error: 'SQL query error - Error when updating the product', details: error });
        }
    },

    delete_product: async (req, res) => {
        const product_id = req.params.product_id;

        // Check if product_id is a valid integer
        if (isNaN(product_id)) {
            return res.status(400).json({ error: 'ID de produit invalide.' });
        }

        try {
            // Check if the product exists before deleting
            const checkExistenceQuery = 'SELECT * FROM products WHERE id = ?';
            const [existenceResult] = await db.promise().query(checkExistenceQuery, [product_id]);

            if (existenceResult.length === 0) {
                return res.status(404).json({ error: 'Product not found when verifying its existence' });
            }

            // The product exists, we can deleted
            const deleteQuery = 'DELETE FROM products WHERE id = ?';
            await db.promise().query(deleteQuery, [product_id]);

            console.log('Product successfully deleted!');
            res.status(200).json({ message: 'Product successfully deleted!' });
        } catch (error) {
            console.error('(delete_product) SQL query error - Error deleting the product :', error);
            res.status(500).json({ error: 'SQL query error - Error deleting the product', details: error });
        }

    }

};

module.exports = product_controller;
