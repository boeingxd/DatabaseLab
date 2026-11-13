// routes/customers.js
const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const tools = require('../controllers/toolsController');

router.get('/:id/orders', customerController.getOrders);   // GET /api/customers/:id/orders
router.get('/:id/orders/explain', tools.explainOrders);    // GET /api/customers/:id/orders/explain   Q3 (done for you)

module.exports = router;
