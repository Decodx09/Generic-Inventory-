const express = require('express');
const router = express.Router();
const { getProducts, getProductById, addProduct, deleteProduct, updateProduct, getProductsByCategory, searchProducts, getFeaturedProducts, categories } = require('../controllers/productController');

router.get('/', getProducts);
router.post('/', addProduct);
router.delete('/:id', deleteProduct);
router.put('/:id', updateProduct); 
router.patch('/:id', updateProduct); 
router.get('/category/:category', getProductsByCategory); 
router.get('/search', searchProducts); 
router.get('/featured', getFeaturedProducts);  
router.get('/categories', categories); 
router.get('/:id', getProductById);

module.exports = router;
