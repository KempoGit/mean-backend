const { response } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../model/user');
const { generateJWT } = require('../helpers/jwt');

const getUsers = async (req, res) => {
    const from = req.query.from || 0;
    const [ users, totalUsers ] = await Promise.all([
        User.find({}, 'name password email')
            .skip(from)
            .limit(5),
        User.countDocuments()
    ]);
    res.json({
        users: users,
        totalUsers: totalUsers
    });
}

const postUsers = async (req, res = response) => {
    const { password, email } = req.body;
    try {
        const emailExists = await User.findOne({ email });
        if (emailExists) {
            res.status(400).json({
                msg: 'Email already exists'
            });
        } else {
            const user = new User(req.body);

            // Password encryption
            const salt = await bcrypt.genSalt();
            user.password = await bcrypt.hash(password, salt);

            // Save user on database
            await user.save();

            // Create token
            const token = await generateJWT(user.id);

            res.status(201).json({
                msg: 'User created',
                user: user,
                token: token
            });
        }
    } catch (error) {
        res.status(500).json({
            msg: 'Error saving user'
        })
    }
}

const putUser = async (req, res = response) => {
    // TODO: Tokken validation & correct user verification

    const userId = req.params.id;

    try {
        // Search for user ID on database
        const userBD = await User.findById(userId);
        // If ID doensn't exist on database
        if (!userBD) {
            res.status(400).json({
                msg: 'User ID does not exist'
            });

        } else {
            const { password, google, email, ...fields } = req.body;

            // If email is different to the existent email, need a mail verification
            // Otherwise dont want to change the email
            if(userBD.email !== email) {
                const emailExists = await User.findOne({ email });
                if (emailExists) {
                    res.status(400).json({
                        msg: 'Email already exists'
                    });
                }
            }

            fields.email = email;
            const updatedUser = await User.findByIdAndUpdate(userId, fields, { new: true });

            res.status(200).json({
                msg: 'User updated',
                user: updatedUser
            });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error updating user'
        })
    }

}

const deleteUser = async (req, res) => {
    const userId = req.params.id;
    try {
        // Search for user ID on database
        const userBD = await User.findById(userId);
        // If ID doensn't exist on database
        if (!userBD) {
            res.status(400).json({
                msg: 'User ID does not exist'
            });

        } else {
            await User.findByIdAndDelete(userId);
            res.status(200).json({
                msg: 'User deleted'
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error deleting user'
        })
    }
}

module.exports = {
    getUsers,
    postUsers,
    putUser,
    deleteUser
}