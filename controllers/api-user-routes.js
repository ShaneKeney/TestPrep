// to be used to log use in, out and otherwise get/updote user data
const express = require('express');
const router = new express.Router();
const bcrypt = require('bcryptjs');
const db = require('../models');
const isAuthenticated = require('../middleware/auth');

router.post('/api/register', async (req, res) => {
    // check to see if password & confirm match else send error
    if(req.body.password !== req.body.confirmPassword) {
        console.log('Passwords do not match');
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
    } catch(e) {
        res.status(400).send(e)
    }
});

router.post('/api/users/login', async (req, res) => {
    try {
        const user = await db.Students.findByCredentials(req.body.email, req.body.password);

        const token = await user.generateAuthToken();
        res.send({ user, token })
    } catch(err) {
        res.status(400).send();
    }
})

router.get('/api/users/me', isAuthenticated, async (req, res) => {
    res.send(req.user);
});

module.exports = router;