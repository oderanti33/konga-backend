const HttpError = require('../Model/http-error');
const { validationResult } = require('express-validator');
const Users = require('../Model/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const getallUsers = async (req, res, next) => {
    let user;
    try {
        user = await Users.find({}, '-password');
    } catch (err) {
        const error = new HttpError('cannot find any user', 505);
        return next(error);
    };

    if (!user || user.length === 0) {
        const error = new HttpError('cannot find any user', 505);
        return next(error);
    }

    res.json({ message: user.map(u => u.toObject({ getters: true })) })
};

const signUp = async (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        const error = new HttpError('invalid input', 422);
        return next(error);
    };

    const { firstName, lastName, email, phoneNumber, password } = req.body;

    let existingUser;
    try {
        existingUser = await Users.findOne({ email: email });
    } catch (err) {
        const error = new HttpError(
            'Signing up failed, please try again later.',
            500
        );
        return next(error);
    }

    if (existingUser) {
        const error = new HttpError(
            'This email is already in use, please login or use a different email address.', 422
        );
        return next(error);
    };

    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
        const error = new HttpError(
            'Could not create user, please try again.',
            500
        );
        return next(error);
    };


    const users = new Users({
        firstName,
        lastName,
        email,
        phoneNumber,
        password: hashedPassword,
    });

    try {
        await users.save()
    } catch (err) {
        const error = new HttpError('user cannot be added', 505);
        return next(error);
    };

    let token;
    try {
        token = jwt.sign({ email: users.email, firstName: users.firstName }, 'crypted_dont_share', { expiresIn: '1hr' })
    } catch (err) {
        const error = new HttpError(
            'Signing up failed, please try again later.',
            500
        );
        return next(error);
    }

    res
        .status(201)
        .json({ firstName: users.firstName, lastName: users.lastName, email: users.email, token: token });
};

const logIn = async (req, res, next) => {
    const { email, password } = req.body;
    let userChecks;
    try {
        userChecks = await Users.findOne({ email: email });
    } catch (err) {
        const error = new HttpError('Could not identify user, seem to be wrong.', 401);
        return next(error);
    };
    if (!userChecks) {
        const error = new HttpError('The email or password you have entered is incorrect. Please try again', 401);
        return next(error);
    };

    let isValidPassword = false;
    try {
        isValidPassword = await bcrypt.compare(password, userChecks.password);
    } catch (err) {
        const error = new HttpError(
            'Could not log you in, please check your credentials and try again.',
            500
        );
        return next(error);
    }

    if (!isValidPassword) {
        const error = new HttpError(
            'Invalid credentials, could not log you in.',
            401
        );
        return next(error);
    }
    let token; try {
        token = jwt.sign({ email: userChecks.email, firstName: userChecks.firstName }, 'crypted_dont_share', { expiresIn: '1hr' })
    } catch (err) {
        const error = new HttpError(
            'login in up failed, please try again later.',
            500
        );
        return next(error);
    }

    res
        .status(201)
        .json({ firstName: userChecks.firstName, lastName: userChecks.lastName, email: userChecks.email, token: token });
};


exports.getallUsers = getallUsers;
exports.signUp = signUp;
exports.logIn = logIn;