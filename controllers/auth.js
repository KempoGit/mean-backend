const { response } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../model/user');
const { generateJWT } = require('../helpers/jwt');

const login = async (req, res = response, next) => {

    const { email, password } = req.body;

    try {
        // Verify email
        const userBD = await User.findOne({ email });
        if(!userBD) {
            return res.status(400).json({ error: 'Email not valid' });
        } else {
            // Verify password
            const isMatch = await bcrypt.compare(password, userBD.password);
            if(!isMatch) {
                return res.status(400).json({ error: 'Password not valid' });
            }
            // Create token
            const token = await generateJWT(userBD.id);
            res.json({ ok: true, token: token });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error });
    }
}

module.exports = {
    login
};