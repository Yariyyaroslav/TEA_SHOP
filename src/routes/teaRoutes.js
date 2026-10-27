const express = require('express');
const teaController = require('../controllers/teaController');
const router = express.Router();
router.get('/', teaController.home);
router.get('/catalog', teaController.catalog);
router.get('/tea/:slug', teaController.details);
module.exports = router;
