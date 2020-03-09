// routes for getting exam information, including
// questions detail and scoring information

// Require db models
const db = require('../models');


module.exports = (app) => {
    // get list of all exams
    app.get('/api/exams', (req, res) => {
        db.Test.findAll()
            .then((tests) => {
                res.json(tests);
            });
    });

    // get list of questions for a specific exam and section
    app.get('/api/exams', (req, res) => {
        db.Test.findAll({
            include: [db.Question]
        })
            .then(questions => {
                res.json(questions);
            });
    });

    // get list of questions for a specific exam and section
    app.get('/api/questions/:testID/:section', (req, res) => {
        db.Question.findAll({
            include: [db.Test],
            where: {
                testID: req.params.testID,
                section: req.params.section
            }
        })
            .then(questions => {
                res.json(questions);
            });
    });
};
