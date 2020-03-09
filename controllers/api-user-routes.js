// to be used to log use in, out and otherwise get/updote user data
const express = require('express');
const Student = require('../models/students');
const router = new express.Router();

router.post('/api/register', async (req, res) => {
    console.log('\n' + JSON.stringify(req.body));

    res.status(201).send('Success');
});


module.exports = router;