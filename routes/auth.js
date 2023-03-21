// Path: /api/login
const { Router } = require('express');
const { check } = require('express-validator');
const { login } = require('../controllers/auth');
const { validate } = require('../middlewares/validator');

const router = Router();

router.post(
    '/',
    [
        check('email','Email is required').isEmail(),
        check('password','Password is required').not().isEmpty(),
        validate
    ],
    login)

module.exports = router;