const express = require('express');
const orderController = require('../controllers/order.controller');

const router = express.Router();

router.get('/', orderController.findAll);
router.get('/search', orderController.search);
router.post('/save', orderController.save);

module.exports = router;