const express = require('express');
const router = express.Router();
const customers = require('../controllers/customerController');
const ctrl = require('../controllers/orderController');

// GET    /customers                       -> customers + order count (function)   Q5
// GET    /customers/:id/orders            -> a customer's orders
// POST   /customers/:id/orders            -> place an order (CALL place_order)    Q5
//        body: { "book_id": 1, "quantity": 2 }
// DELETE /customers/:id/orders/:orderId   -> cancel (the trigger restores stock)  Q5
router.get('/', customers.list);
router.get('/:id/orders', ctrl.listForCustomer);
router.post('/:id/orders', ctrl.placeOrder);
router.delete('/:id/orders/:orderId', ctrl.cancelOrder);

module.exports = router;
