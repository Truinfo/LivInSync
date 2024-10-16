
const express = require('express');
const { addProduct, getSocietyProducts, getProductById, deleteProduct, getProductByUserId } = require('../controllers/MarketPlace');

const router = express.Router();

router.post('/AddItems', addProduct);
router.get('/getSocietyItems/:societyId', getSocietyProducts);
router.get('/getItemBy/:id', getProductById);
router.delete('/deleteItem/:id', deleteProduct);
router.get('/getMyAddByid/:userId', getProductByUserId);

module.exports = router;