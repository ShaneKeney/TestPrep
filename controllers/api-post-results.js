// Require db models
const db = require('../models');
const isAuthenticated = require('../middleware/auth');

module.exports = (app) => {
    app.post('/api/results', isAuthenticated, function(req, res) {
        console.log(req.body);
        db.SectionResultsDetails.bulkCreate(req.body).then(function(results) {
            res.json(results);
        });
    });
};