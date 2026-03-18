const express = require('express');
const {
    addOrderItems,
    getOrderById,
    getMyOrders,
    getOrders,
} = require('../controllers/order.controller');
const { protect, admin } = require('../middleware/auth.middleware');
const { validate, orderValidation } = require('../middleware/validation.middleware');

const router = express.Router();

router.route('/').post(protect, validate(orderValidation), addOrderItems).get(protect, admin, getOrders);
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById);

module.exports = router;
