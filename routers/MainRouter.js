const express = require('express');
const router = express.Router();

const { addNewProduct, getAllProducts, getProductById } = require('../controllers/ProductController');

const { registrationValidation, loginValidation } = require('../middleware/TP-Validator');

const { registerUser, loginUser, getUser, updateUserInfo } = require('../controllers/TP-UserController');

const { addNote, getNotes, removeNote, updateNote } = require('../controllers/TP-NotesController');

const { RRregistrationValidation, RRloginValidation } = require('../middleware/RR-Validator');

const {
  RRregisterUser,
  RRloginUser,
  RRgetUser,
  RRupdateUserInfo,
  RRremoveUserInfo,
} = require('../controllers/RR-UserController');

// TASK PLANNER ROUTES
router.post('/tp/register', registrationValidation, registerUser);
router.post('/tp/login', loginValidation, loginUser);
router.get('/tp/user/:secret', getUser);
router.patch('/tp/user/:secret', updateUserInfo);

router.post('/tp/notes', addNote);
router.get('/tp/notes/:userId', getNotes);
router.patch('/tp/notes/:noteId', updateNote);
router.delete('/tp/notes/:noteId', removeNote);

// RANDOM MEAL ROUTES
router.post('/rr/register', RRregistrationValidation, RRregisterUser);
router.post('/rr/login', RRloginValidation, RRloginUser);
router.patch('/rr/users/:userId', RRupdateUserInfo);
router.delete('/rr/users/:userId&:mealId', RRremoveUserInfo);
// GAMEBUY ROUTES
router.post('/add-product', addNewProduct);
router.get('/products', getAllProducts);
router.get('/products/:gameId', getProductById);

module.exports = router;
