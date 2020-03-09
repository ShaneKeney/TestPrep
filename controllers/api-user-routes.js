// to be used to log use in, out and otherwise get/updote user data
const express = require('express');
const router = new express.Router();
const bcrypt = require('bcryptjs');
const db = require('../models');

router.post('/api/register', async (req, res) => {
    // check to see if password & confirm match else send error
    if(req.body.password !== req.body.confirmPassword) {
        console.log('Passwords do not match');
        res.status(404).send('PASS_MISMATCH');
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
        
        res.status(201).send('Success');
    } catch(e) {
        console.log(e);
        res.status(400).send(e)
    }
});


module.exports = router;