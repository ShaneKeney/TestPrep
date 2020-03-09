const db = require('../models');

module.exports = (app) => {

    app.get('/api/exams/sections/:testID', (req, res) => {

        db.Question.findAll({
            where: {
                TestId: req.params.testID
            },
            attributes: [
                [db.Sequelize.fn('DISTINCT', db.Sequelize.col('section')) ,'section']
            ]
        })
            .then((questions) => {
                res.json(questions);
            });
    });

    app.get('/api/exams/:testID/questions/:type/:section', (req, res) => {
        db.Test.findAll({
            where: {id: req.params.testID},
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
        }).then((results)=>{
            const data = {
                details: {
                    name: results[0].exam,
                    type: results[0].type
                },
                questions: results[0].Questions
            };

            res.render('bubblesheet', data);
        });
    });

};
