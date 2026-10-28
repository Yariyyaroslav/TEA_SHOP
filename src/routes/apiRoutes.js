const express = require('express');
const { listTeas, getTeaBySlug, createOrder } = require('../controllers/apiController');

const router = express.Router();

router.get('/teas', listTeas);
router.get('/teas/:slug', getTeaBySlug);
router.post('/orders', createOrder);

module.exports = router;
