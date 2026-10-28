const express = require('express');
const orderController = require('../controllers/orderController');
const router = express.Router();
router.get('/cart', orderController.view);
router.post('/cart/add/:id', orderController.add);
router.post('/cart/remove/:id', orderController.remove);
router.get('/checkout', orderController.checkout);
router.post('/checkout', orderController.createOrder);
module.exports = router;
