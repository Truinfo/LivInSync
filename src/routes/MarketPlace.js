// routes/marketplaceRoutes.js
const express = require('express');
const { addProduct, getSocietyProducts, getProductById, deleteProduct } = require('../controllers/MarketPlace');
const { userMiddleware } = require('../common-middlewares');

const router = express.Router();

router.post('/AddItems', addProduct); // Add new product
router.get('/getSocietyItems/:societyId', getSocietyProducts); // Get all products
router.get('/getItemBy/:id', getProductById); // Get product by ID
router.delete('/deleteItem/:id', deleteProduct); // Delete product

module.exports = router;