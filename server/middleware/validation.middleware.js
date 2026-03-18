const { check, validationResult } = require('express-validator');

// Reusable validator function
const validate = (validations) => {
    return async (req, res, next) => {
        await Promise.all(validations.map((validation) => validation.run(req)));

        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }

        res.status(400).json({ errors: errors.array() });
    };
};

// Validation rules
const registerValidation = [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be 6 or more characters').isLength({
        min: 6,
    }),
];

const loginValidation = [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
];

const productValidation = [
    check('name', 'Name is required').not().isEmpty(),
    check('price', 'Price must be a number').isNumeric(),
    check('stock', 'Stock must be an integer').isInt(),
];

const orderValidation = [
    check('orderItems', 'Order items must be an array and not empty').isArray({ min: 1 }),
    check('totalPrice', 'Total price must be a number').isNumeric(),
];

module.exports = {
    validate,
    registerValidation,
    loginValidation,
    productValidation,
    orderValidation,
};
