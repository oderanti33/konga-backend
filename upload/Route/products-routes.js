const express = require('express');
const { check } = require('express-validator');
const checkAuth = require('../Middleware/checkAuth')

router = express.Router();


const productsControllers = require('../Controller/products-controllers');


router.get('/', productsControllers.getallProducts);


router.get('/:turl', productsControllers.getproductbyUrl);

router.use(checkAuth);

router.post('/product', [check('id').notEmpty(), check('category1').notEmpty(), check('category2').notEmpty(), check('category').notEmpty(), check('title').notEmpty(), check('price').notEmpty()], productsControllers.createProduct);

module.exports = router;