const express = require('express');
const router = express.Router();

const { addNewProduct, getAllProducts, getProductById } = require('../controllers/ProductController');

const { registrationValidation, loginValidation } = require('../middleware/TP-Validator');

const { registerUser, loginUser, getUser, updateUserInfo } = require('../controllers/TP-UserController');

const { addNote, getNotes, removeNote } = require('../controllers/TP-NotesController');

// TASK PLANNER ROUTES
router.post('/tp/register', registrationValidation, registerUser);
router.post('/tp/login', loginValidation, loginUser);
router.get('/tp/user/:secret', getUser);
router.patch('/tp/user/:secret', updateUserInfo);

router.post('/tp/notes', addNote);
router.get('/tp/notes/:userId', getNotes);
router.delete('/tp/notes/:noteId', removeNote);

// GAMEBUY ROUTES
router.post('/add-product', addNewProduct);
router.get('/products', getAllProducts);
router.get('/products/:gameId', getProductById);

module.exports = router;
