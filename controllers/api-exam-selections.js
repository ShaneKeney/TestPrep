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
        // HELPER FUNCTION FOR
        // SELECTORS SUCH AS
        // {{#if mc}} AND {{#if num}}
        // FOR QUESTION TYPES
        // INSIDE bubblesheet.handlebars
        const populateQuestionArray = questionArr => {
            const questionsArr = [];
            questionArr.forEach(question => {
                questionsArr.push({
                    dataValues: question.dataValues,
                    writing: question.dataValues.section === 'writing',
                    reading: question.dataValues.section === 'reading',
                    mathNC: question.dataValues.section === 'mathNC',
                    mathC: question.dataValues.section === 'mathC',
                    mc: question.dataValues.question_type === 'mc',
                    num: question.dataValues.question_type === 'num'
                            || question.dataValues.question_type === 'array'
                            || question.dataValues.question_type === 'range'
                });
            });

            return questionsArr;
        };

        if (req.params.section === 'all') {
            db.Test.findAll({
                where: { id: req.params.testID },
                include: {
                    model: db.Question
                },
                order: [
                    [db.Question, 'question_number', 'ASC']
                ]
            }).then( results => {

                const questionsArr = populateQuestionArray(results[0].Questions);

                let sectionName = questionsArr[0].dataValues.section.substr(0, 1).toUpperCase() + questionsArr[0].dataValues.section.substr(1);
                const data = {
                    details: {
                        name: results[0].exam,
                        section: sectionName,
                        type: results[0].type.toUpperCase()
                    },
                    questions: questionsArr
                };
                res.render('all-sections', data);


            });
        } else {
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
                const questionsArr = populateQuestionArray(results[0].Questions);

                let sectionName = questionsArr[0].dataValues.section.substr(0, 1).toUpperCase() + questionsArr[0].dataValues.section.substr(1);
                const data = {
                    details: {
                        name: results[0].exam,
                        section: sectionName,
                        type: results[0].type.toUpperCase()
                    },
                    questions: questionsArr
                };
                res.render('bubblesheet', data);
            });
        }
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
