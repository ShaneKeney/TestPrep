const db = require('../models');
const isAuthenticated = require('../middleware/auth');
module.exports = (app) => {

    app.get('/api/exams/sections/:testID', isAuthenticated, (req, res) => {
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

    app.get('/bubblesheet/exams/:testID/questions/:section', (req, res) => {
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
                    num: question.dataValues.question_type === 'num' || question.dataValues.question_type === 'arr' || question.dataValues.question_type === 'range'
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
    // get a list of the tests a user has already started or finished from the results table
    app.get('/api/prevexams', isAuthenticated, (req, res) => {
        db.SectionResultsDetails.findAll({
            where: {
                StudentId: req.user.dataValues.id
            },
            attributes: [
                [db.Sequelize.fn('DISTINCT', db.Sequelize.col('TestId')), 'TestId']
            ]
        })
            // with that list get the test names from the Test table
            .then((testIds) => {
                // get the test ids out of the object and into an array to search the db with
                var testIdArr = [];
                testIds.forEach(element => {
                    testIdArr.push(element.dataValues.TestId);
                });
                db.Test.findAll({
                    where: {
                        id: testIdArr
                    }
                }).then(tests => {
                    // with resulting list of tests, create an array with objects of test names and ids
                    var examArr = [];
                    tests.forEach(e => {
                        examArr.push({
                            exam: e.dataValues.exam,
                            testID: e.dataValues.id
                        });
                    });
                    // send the array to the front end
                    res.json(examArr);
                });
            });
    });

    // get all sections for a specific test (user param not yet in use)
    app.get('/api/sections/:userId/:testId', isAuthenticated, (req,res)=>{
        db.Question.findAll({
            where: {
                TestId: req.params.testId
            },
            attributes: [
                [db.Sequelize.fn('DISTINCT', db.Sequelize.col('section')),'section']
            ]
        })
            .then(sections=>{
                // create just an array of section names to send back
                var sectionsArr = [];
                sections.forEach(e=>{
                    sectionsArr.push(e.dataValues.section);
                });
                // should also then get the list of actual sections started/completed by that user
                res.json(sectionsArr);
            });
    });
};


