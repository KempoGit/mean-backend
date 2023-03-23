const { response } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../model/user');
const { generateJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');

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

const loginWithGoogle = async(req, res = response) => {
    try {
        // Google token verify
        const { email, name, picture } = await googleVerify(req.body.token);
        const userBD = await User.findOne({ email });
        let user;
        // If is not on database will create a new user
        // Otherwise set database user to current user
        if(!userBD) {
            user = new User({
                name,
                email,
                password: 'password',
                img: picture,
                google: true
            });
        } else {
            user = userBD;
            user.google = true;
        }

        await user.save();

        // Create token
        const token = await generateJWT(user.id);

        res.json({
            ok: true,
            email,
            name,
            picture,
            token
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error });
    }
}

module.exports = {
    login,
    loginWithGoogle
};