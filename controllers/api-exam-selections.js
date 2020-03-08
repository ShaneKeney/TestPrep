const db = require('../models');

module.exports = (app) => {
    // get list of all exams
    app.get('/api/exams', (req, res) => {
        db.Test.findAll({
            where: {id: 1},
            include: [db.Question]
        }).then((questions)=>{
            res.json(questions);
        });
    });

    app.get('/api/exams/sections/:id', (req, res) => {

        db.Question.findAll({
            where: {
                TestId: req.params.id
            },
            attributes: [
                [db.Sequelize.fn('DISTINCT', db.Sequelize.col('section')) ,'section']
            ]
        })
            .then((questions) => {
                res.json(questions);
            });
    });

    app.get('/api/exams/:id/questions/:type/:section', (req, res) => {
        db.Test.findAll({
            where: {id: req.params.id},
            include: {
                model: db.Question,
                where: {
                    question_type: req.params.type,
                    section: req.params.section
                }
            },
            order: [
                [db.Question, 'question_number', 'ASC']
            ]
        }).then((questions)=>{
            res.json(questions);
        });
    });

};