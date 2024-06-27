const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Registrasi pengguna baru
router.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        });

        const newUser = await user.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Login pengguna dan menghasilkan token
router.post('/login', async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user == null) {
        return res.status(400).json({ message: 'Cannot find user' });
    }
    try {
        if (await bcrypt.compare(req.body.password, user.password)) {
            const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET);
            res.json({ accessToken, name: user.name });
        } else {
            res.status(403).json({ message: 'Incorrect password' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
