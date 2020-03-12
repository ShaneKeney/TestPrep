// routes for getting and setting user's scores and
// test results

// Require db models
const db = require('../models');
const isAuthenticated = require('../middleware/auth');

module.exports = (app) => {
    // get list of all previously completed exams for user
    app.get('/api/exams', isAuthenticated, (req, res) => {
        db.Test.findAll()
            .then((tests) => {
                res.json(tests);
            });
    });

    // get list of questions for a specific exam and section
    app.get('/api/questions/:testID/:section', isAuthenticated, (req, res) => {
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