// Require db models
const db = require('../models');


module.exports = (app) => {
    app.post('/api/results', function(req, res) {
        console.log(req.body);
        db.SectionResultsDetails.bulkCreate(req.body).then(function(results) {
            res.json(results);
        });
    });
};