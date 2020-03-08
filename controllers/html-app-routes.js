// once user is logged in routes for serving various
// html pages (for taking tests, reviewing reports, etc.)

// Require db models
const db = require('../models');

module.exports = (app) => {
    // get list of all exams
    app.get('/reports/:StudentId/:TestId', (req, res) => {
        var StudentId = 1;
        var TestId = 1;
        var resultDetails;
        var sectionList;
        var questionList;
        var score;
        // search the sectionResultsDetails based on the StudentId and TestId
        db.SectionResultsDetails.findAll({
            where: {
                StudentId: StudentId,
                TestId: TestId
            }
        })
            .then(data => {
                resultDetails = data;
                // search Questions based on TestId for distinct sections
                // db.Question.aggregate('section','DISTINCT',{
                //     where: {
                //         TestId: TestId
                //     }
                // })
                db.Question.findAll({
                    attributes: [[db.sequelize.fn('DISTINCT', db.sequelize.col('section')), 'section']],
                    where: {
                        TestId: TestId
                    }
                })
                    .then(data => {
                        sectionList = data;
                        // search the questions table based on TestId for all the questions
                        db.Question.findAll({
                            where: {
                                TestId: TestId
                            },
                            include: db.Test
                        })
                            .then(data => {
                                questionList = data;
                                // manually match up question list with answers by resultDetails section and question_number
                                questionList.map(question => {
                                    // get the record from the students answers if it matches the section and question number of the current question
                                    const studentAnswer = resultDetails.filter(answer => {
                                        if (question.dataValues.section === answer.dataValues.section && question.dataValues.question_number === answer.dataValues.question_number) {
                                            return true;
                                        }
                                    })[0];
                                    // if there was a matching record attach just the student's answer to the question record
                                    if (studentAnswer) {
                                        question.dataValues.studentAnswer = studentAnswer.dataValues.answer_response;
                                    }
                                    if (question.dataValues.studentAnswer === question.dataValues.ans_actual){
                                        question.dataValues.ans_actual = '+';
                                        question.wrong = false;
                                        question.omitted = false;
                                    } else if (question.dataValues.studentAnswer) {
                                        question.wrong = true;
                                    } else {
                                        question.omitted = true;
                                        question.dataValues.studentAnswer = '-';
                                    }
                                });
                                // send the report page, with variables for handlebars
                                res.render('report', {
                                    object: 'object',
                                    questionList: questionList,
                                    sectionList: sectionList
                                });
                            }).catch(err => {
                                console.log(err);
                                res.status(500).send();
                            });
                    });
            });

    });
};