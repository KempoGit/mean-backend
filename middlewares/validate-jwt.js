const jwt = require('jsonwebtoken');

const validateJWT = (req, res, next) => {
    const token = req.headers['x-token'];
    if (!token) {
        return res.status(401).json({ message: 'No token provided.' });
    }
    try {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Failed to authenticate token.' });
            }
            req.id = decoded.id;
            next();
        });

    } catch (err) {
        return res.status(401).json({ message: 'Token not valid.' });
    }
};

module.exports = {
    validateJWT
}