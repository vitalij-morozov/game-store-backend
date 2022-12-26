const express = require('express');
const router = express.Router();

const { addNewProduct, getAllProducts, getProductById } = require('../controllers/ProductController');

const { registrationValidation, loginValidation } = require('../middleware/TP-Validator');
const { registerUser, loginUser, getUser } = require('../controllers/TP-UserController');

// TASK PLANNER ROUTES
router.post('/tp/register', registrationValidation, registerUser);
router.post('/tp/login', loginValidation, loginUser);
router.get('/tp/user/:secret', getUser);

// GAMEBUY ROUTES
router.post('/add-product', addNewProduct);
router.get('/products', getAllProducts);
router.get('/products/:gameId', getProductById);

module.exports = router;
