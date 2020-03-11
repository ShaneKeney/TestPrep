const db = require('../models');

module.exports = (app) => {

    app.get('/api/exams/sections/:testID', (req, res) => {

        db.Question.findAll({
            where: {
                TestId: req.params.testID
            },
            attributes: [
                [db.Sequelize.fn('DISTINCT', db.Sequelize.col('section')), 'section']
            ]
        })
            .then((questions) => {
                res.json(questions);
            });
    });

    app.get('/api/exams/:testID/questions/:section', (req, res) => {
        db.Test.findAll({
            where: { id: req.params.testID },
            include: {
                model: db.Question,
                where: {
                    section: req.params.section
                }
            },
            order: [
                [db.Question, 'question_number', 'ASC']
            ]
        }).then((results) => {

            // HELPER FUNCTION SO THAT WE CAN USE
            // {{#if mc}} AND {{#if num}}
            // FOR QUESTION TYPES
            // INSIDE bubblesheet.handlebars
            const questionsArr = [];
            results[0].Questions.forEach(question => {
                if (question.dataValues.question_type === 'mc') {
                    questionsArr.push({
                        dataValues: question.dataValues,
                        mc: true,
                    });
                } else if (question.dataValues.question_type === 'num'
                    || question.dataValues.question_type === 'array'
                    || question.dataValues.question_type === 'range') {
                    questionsArr.push({
                        dataValues: question.dataValues,
                        num: true
                    });
                }
            });
            // END HELPER

            const data = {
                details: {
                    name: results[0].exam,
                    type: results[0].type
                },
                questions: questionsArr
            };

            res.render('bubblesheet', data);
        });
    });

    app.get('/api/exams/:userId', (req, res) => {
        db.SectionResultsDetails.findAll({
            where: {
                StudentId: req.params.userId
            },
            attributes: [
                [db.Sequelize.fn('DISTINCT', db.Sequelize.col('TestId')), 'TestId']
            ]
        })
            .then((testIds) => {
                var testIdArr = [];
                testIds.forEach(element => {
                    testIdArr.push(element.dataValues.TestId);
                });
                db.Test.findAll({
                    where: {
                        id: testIdArr
                    }
                }).then(tests => {
                    var examArr = [];
                    tests.forEach(e => {
                        examArr.push({
                            exam: e.dataValues.exam,
                            testID: e.dataValues.id
                        });
                    });
                    res.json(examArr);
                });
            });
    });

    app.get('/api/sections/:userId/:testId', (req,res)=>{
        db.Question.findAll({
            where: {
                TestId: req.params.testId
            },
            attributes: [
                [db.Sequelize.fn('DISTINCT', db.Sequelize.col('section')),'section']
            ]
        })
            .then(sections=>{
                var sectionsArr = [];
                sections.forEach(e=>{
                    sectionsArr.push(e.dataValues.section);
                });
                res.json(sectionsArr);
            });
    });
};
