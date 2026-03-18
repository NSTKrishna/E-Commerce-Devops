const express = require('express');
const { registerUser, loginUser } = require('../controllers/auth.controller');
const { validate, registerValidation, loginValidation } = require('../middleware/validation.middleware');

const router = express.Router();

router.post('/register', validate(registerValidation), registerUser);
router.post('/login', validate(loginValidation), loginUser);

module.exports = router;
