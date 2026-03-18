const express = require('express');
const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
} = require('../controllers/product.controller');
const { protect, admin } = require('../middleware/auth.middleware');
const { validate, productValidation } = require('../middleware/validation.middleware');

const router = express.Router();

router.route('/').get(getProducts).post(protect, admin, validate(productValidation), createProduct);
router
    .route('/:id')
    .get(getProductById)
    .put(protect, admin, validate(productValidation), updateProduct)
    .delete(protect, admin, deleteProduct);

module.exports = router;
