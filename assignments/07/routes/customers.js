const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/orderController');

// GET    /customers/:id/orders            -> a customer's orders
// POST   /customers/:id/orders            -> place an order  (Q2, Q3, Q4)
//        body: { "book_id": 1, "quantity": 2 }
// DELETE /customers/:id/orders/:orderId   -> cancel an order (Q5)
router.get('/:id/orders', ctrl.listForCustomer);
router.post('/:id/orders', ctrl.placeOrder);
router.delete('/:id/orders/:orderId', ctrl.cancelOrder);

module.exports = router;
