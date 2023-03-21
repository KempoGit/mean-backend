const jwt = require('jsonwebtoken');

const generateJWT = ( uid ) => {
    return new Promise((resolve, reject ) => {
        jwt.sign( { uid }, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) {
                console.log(err);
                reject('JWT ERROR');
            } else {
                resolve(token);
            }
        });
    });
}

module.exports = {
    generateJWT
};