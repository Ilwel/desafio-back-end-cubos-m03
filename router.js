const express = require('express');
const router = express();
const users = require('./controllers/users')

router.post('/cadastro', users.postUserRegistration);
router.post('/login');

module.exports = router;