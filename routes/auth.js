// Path: /api/login
const { Router } = require('express');
const { check } = require('express-validator');
const { login, loginWithGoogle } = require('../controllers/auth');
const { validate } = require('../middlewares/validator');

const router = Router();

router.post(
    '/',
    [
        check('email','Email is required').isEmail(),
        check('password','Password is required').not().isEmpty(),
        validate
    ],
    login
)

router.post(
    '/google',
    [
        check('token','Google token is required').not().isEmpty(),
        validate
    ],
    loginWithGoogle
)

module.exports = router;