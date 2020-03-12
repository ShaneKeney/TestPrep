// to be used to log use in, out and otherwise get/updote user data
const express = require('express');
const router = new express.Router();
const bcrypt = require('bcryptjs');
const db = require('../models');
const isAuthenticated = require('../middleware/auth');

router.post('/api/register', async (req, res) => {
    // check to see if password & confirm match else send error
    if (req.body.password !== req.body.confirmPassword) {
        res.status(401).send('PASS_MISMATCH');
    }

    //hash password and create new user/student
    try {
        let hashedPassword = await bcrypt.hash(req.body.password, 8);

        let newUser = await db.Students.create({
            first_name: req.body.firstName,
            last_name: req.body.lastName,
            email: req.body.email,
            phone: req.body.phone,
            password: hashedPassword
        });
        const token = await newUser.generateAuthToken();
        res.status(201).send({ user: newUser, token });
    } catch (e) {
        res.status(400).send(e);
    }
});

router.post('/api/users/login', async (req, res) => {
    try {
        const user = await db.Students.findByCredentials(req.body.email, req.body.password);

        const token = await user.generateAuthToken();
        res.send({ user, token });
    } catch(err) {
        res.status(400).send();
    }
});

router.post('/api/users/logout', isAuthenticated, async (req, res) => {
    try {
        req.user.tokens = null;
        await req.user.save();

        res.send();
    } catch (err) {
        res.status(500).send();
    }
});

router.get('/api/users/me', isAuthenticated, async (req, res) => {
    res.send(req.user);
});

// TODO: Hook up update profile functionality on front end
router.patch('/api/users/me', isAuthenticated, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['first_name', 'last_name', 'email', 'phone', 'password'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if(!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!'});
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update]);
        await req.user.save();
        res.send(req.user);
    } catch(err) {
        res.status(400).send(err);
    }
});

module.exports = router;