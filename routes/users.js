// Ruta: /api/users

const { Router } = require('express');
const { check } = require('express-validator');
const { getUsers, postUsers, putUser, deleteUser } = require('../controllers/users');
const { validate } = require('../middlewares/validator');
const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();


router.get(
    '/',
    validateJWT,
    getUsers
);

router.post(
    '/',
    [   validateJWT,
        check('name', 'Name is required').not().isEmpty(),
        check('password', 'Password is required').not().isEmpty(),
        check('email', 'Email is required').isEmail(),
        validate,
    ],
    postUsers
);

router.put(
    '/:id',
    [
        validateJWT,
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Email is required').isEmail(),
        check('role', 'Role is required').not().isEmpty(),
    ],
    putUser
);

router.delete(
    '/:id',
    validateJWT,
    deleteUser
);


module.exports = router;