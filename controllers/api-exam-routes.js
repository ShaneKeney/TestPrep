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
    // get all questions of one  section of specific exam
    app.get('/api/exams/:examID/:section', (req, res) => {
        db.Test.findAll({
            where: {
                id: req.params.examID
            },
            // include: [{
            //     model: db.Question,
            //     where: {
            //         section: req.params.section
            //     }
            // }]
            include: [db.Question]
        }).then((questions) => {
            res.json(questions);
        },
        (error)=>{
            console.log(error);
        });
    });

    app.get('/api/questions',(req,res)=>{
        db.Question.findAll({
            include: [db.Test]
        })
            .then(questions=>{
                res.json(questions);
            });
    });

};