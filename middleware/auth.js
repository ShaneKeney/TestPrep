const jwt = require('jsonwebtoken');
const Students = require('../models/students');
const db = require('../models');

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userArray = await db.Students.findAll({
            where: {
                id: decoded.id,
                tokens: token
            }
        });

        const user = userArray[0];
        if(!user) {
            throw new Error();
        }

        req.token = token;
        req.user = user;
        next();
    } catch (err) {
        res.status(401).send({ error: 'Please authenticate.' });
    }
};

module.exports = isAuthenticated;