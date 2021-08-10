const express = require('express');
const router = express();
const users = require('./controllers/users')
const { body } = require('express-validator');

router.post('/cadastro', body('email').isEmail(), body('senha').isLength({min:8}) ,users.postUserRegistration);
router.post('/login');

module.exports = router;