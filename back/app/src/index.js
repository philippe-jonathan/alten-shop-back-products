const express = require('express');
const app = express();
app.use(express.json());
const port = 3000;

const products_router = require('./routes/products');

// Test if API is UP
app.get('/', (req, res) => {
    res.send('Works!');
});

// Database config
const db = require('./config/db_connection');

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database :', err);
    } else {
        console.log('Connected to the database');

        // Set session time zone for Europe/Paris
        db.query('SET time_zone = "+01:00"', (err, result) => {
            if (err) {
                console.error('Error setting up time zone:', err);
            } else {
                console.log('Time zone configured successfully');
            }
        });

        app.listen(port, () => {
            console.log(`Server started on port ${port}`);
        });
        
        // Use routes
        app.use('/products', products_router);
        
    }
});