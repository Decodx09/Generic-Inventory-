const express = require('express');
const router = express.Router();
const { addItemToCart, getCartItems } = require('../controllers/cartController');

router.post('/add', addItemToCart);
router.get('/:userId', getCartItems);

module.exports = router;
