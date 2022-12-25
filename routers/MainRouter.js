const express = require('express');
const router = express.Router();

const { addNewProduct, getAllProducts, getProductById } = require('../controllers/ProductController');

router.post('/add-product', addNewProduct);

router.get('/products', getAllProducts);
router.get('/products/:gameId', getProductById);

module.exports = router;
