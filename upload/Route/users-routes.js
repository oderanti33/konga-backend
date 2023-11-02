const express = require('express');
const { check } = require('express-validator');

router = express.Router();

const usersControllers = require('../Controller/users-controllers')


router.get('/', usersControllers.getallUsers);
router.post('/signup', [check('firstName').notEmpty(), check('lastName').notEmpty(), check('email').notEmpty().isEmail(), check('password').notEmpty().isLength({ min: 6 })], usersControllers.signUp);
router.post('/login', usersControllers.logIn);

module.exports = router;