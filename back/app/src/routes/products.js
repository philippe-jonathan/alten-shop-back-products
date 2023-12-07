const express = require('express');
const router = express.Router();
const products_controller = require('../controllers/products_controller');

// GET
router.get('/', products_controller.get_all_products);
router.get('/:product_id', products_controller.get_product_by_id);

// POST
router.post('/', products_controller.create_product);

// PATCH
router.patch('/:product_id', products_controller.update_product);

// DELETE
router.delete('/:product_id', products_controller.delete_product);

module.exports = router;