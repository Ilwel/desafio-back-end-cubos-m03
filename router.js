const express = require('express');
const router = express();
const users = require('./controllers/users');
const products = require('./controllers/products');
const checkLogin = require('./middlewares/checkLogin');
const { body } = require('express-validator');

//user routes
router.post('/cadastro', body('email').isEmail(), body('senha').isLength({min:8}) ,users.postUserRegistration);
router.post('/login', users.postUserLogin);
router.get('/perfil', checkLogin ,users.getProfile);
router.put('/perfil', checkLogin,  body('email').isEmail(), body('senha').isLength({min:8}), users.putProfile);

//products routs
router.get('/produtos', checkLogin, products.getProducts);

module.exports = router;