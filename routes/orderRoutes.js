const express = require('express');
const router = express.Router();
const { createOrder, getOrdersByUser, orders, deleteOrder, updateOrder, searchProducts, getFeaturedProducts, getProductsByCategory} = require('../controllers/orderController');

router.post('/', createOrder);
router.get('/:userId', getOrdersByUser);
router.get('/', orders);
router.delete('/:orderId', deleteOrder);
// router.put('/:orderId', updateOrder);
// router.patch('/:orderId', updateOrder);
// router.get('/search', searchProducts);
// router.get('/featured', getFeaturedProducts);
// router.get('/category/:category', getProductsByCategory);
// router.get('/search', searchProducts);
// router.get('/featured', getFeaturedProducts);
// router.get('/category/:category', getProductsByCategory);

module.exports = router;
