// once user is logged in routes for serving various
// html pages (for taking tests, reviewing reports, etc.)

// Require db models
const db = require('../models');

module.exports = (app) => {
    // get get report of exam results taken by a student
    app.get('/reports/:StudentId/:TestId', (req, res) => {
        var StudentId = 1;
        var TestId = 1;
        var resultDetails;
        var sectionList;
        var questionList;
        var scoreList;
        var scoreCount = {};
        var skippedCount = {};
        var easyCorrect = {};
        var medCorrect = {};
        var hardCorrect = {};
        // search the sectionResultsDetails based on the StudentId and TestId
        db.SectionResultsDetails.findAll({
            where: {
                StudentId: StudentId,
                TestId: TestId
            }
        })
            .then(data => {
                resultDetails = data;
                db.SatCurve.findAll({
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
                                questionList.forEach(question => {
                                    // create a new property on the questions for an adjusted section name
                                    // in order to match with SatCurve scoring table
                                    // using switch for easy additions later
                                    switch (question.dataValues.section) {
                                        case 'mathNC': question.dataValues.modSection = 'math';
                                            break;
                                        case 'mathC': question.dataValues.modSection = 'math';
                                            break;
                                        default: question.dataValues.modSection = question.dataValues.section;
                                    }
                                    // get the record from the students answers if it matches the section and question number of the current question
                                    // chose this method as we did not create direct relations between the tables
                                    const studentAnswer = resultDetails.filter(answer => {
                                        if (question.dataValues.section === answer.dataValues.section
                                            && question.dataValues.question_number === answer.dataValues.question_number) {
                                            return true;
                                        }
                                    })[0];
                                    // if there was a matching record attach just the student's answer to the question record
                                    if (studentAnswer) {
                                        question.dataValues.studentAnswer = studentAnswer.dataValues.answer_response;
                                    }
                                    var modSection = question.dataValues.modSection;
                                    // checks if property exists yet, and creates it with a zero value if not
                                    function createPropOn(obj) {
                                        if (!obj[modSection]) {
                                            obj[modSection] = 0;
                                        }
                                    }
                                    createPropOn(scoreCount);
                                    createPropOn(skippedCount);
                                    createPropOn(easyCorrect);
                                    createPropOn(medCorrect);
                                    createPropOn(hardCorrect);

                                    // check the validity of the student's answer
                                    // set variables to store right/wrong/skipped
                                    if (question.dataValues.studentAnswer === question.dataValues.ans_actual) {
                                        // switch actual answer to a + symbol for easier reading of the report for accurate answers
                                        question.dataValues.ans_actual = '+';
                                        question.wrong = false;
                                        question.omitted = false;
                                        // update the score count for the section
                                        scoreCount[modSection] += 1;
                                        // update the count of the difficulty variables
                                        switch (question.dataValues.difficulty) {
                                            case 'e': easyCorrect[modSection] += 1;
                                                break;
                                            case 'm': medCorrect[modSection] += 1;
                                                break;
                                            case 'h': hardCorrect[modSection] += 1;
                                                break;
                                            default: '';
                                        }
                                    } else if (question.dataValues.studentAnswer) {
                                        question.wrong = true;
                                    } else {
                                        question.omitted = true;
                                        skippedCount[modSection] += 1;
                                        // set a dash to display if it was skipped
                                        question.dataValues.studentAnswer = '-';
                                    }
                                });
                            });

                        // get scoring table for the test
                        db.SatCurve.findAll({
                            where: {
                                TestId: TestId
                            }
                        })
                            .then(data => {
                                scoreList = data;
                                // scoring calculations section
                                // create properties for calculations based on each section
                                sectionList.forEach(sectionRecord => {
                                    var section = sectionRecord.dataValues.section;
                                    // function to count questions based on difficulty
                                    function countDiff(diff) {
                                        return questionList.filter(item => {
                                            if (item.dataValues.difficulty === diff
                                                && item.dataValues.modSection === section) {
                                                return true;
                                            } else {
                                                return false;
                                            }
                                        }).length;
                                    }
                                    sectionRecord.easyCount = countDiff('e');
                                    sectionRecord.medCount = countDiff('m');
                                    sectionRecord.hardCount = countDiff('h');
                                    sectionRecord.easyCorrect = easyCorrect[section];
                                    sectionRecord.medCorrect = medCorrect[section];
                                    sectionRecord.hardCorrect = hardCorrect[section];
                                    sectionRecord.easyPercent = (sectionRecord.easyCorrect / sectionRecord.easyCount * 100).toFixed(1);
                                    sectionRecord.medPercent = (sectionRecord.medCorrect / sectionRecord.medCount * 100).toFixed(1);
                                    sectionRecord.hardPercent = (sectionRecord.hardCorrect / sectionRecord.hardCount * 100).toFixed(1);
                                    // get number of questions in the section
                                    sectionRecord.totalQs = scoreList.filter(scoreRecord => {
                                        if (scoreRecord.dataValues.section === section) {
                                            return true;
                                        }
                                    }).length - 1;
                                    // properties for skipped questions, correct answers, percent correct, and incorrect answers, etc.
                                    sectionRecord.skippedCount = skippedCount[section];
                                    sectionRecord.numberCorrect = scoreCount[section];
                                    sectionRecord.percentCorrect = (sectionRecord.numberCorrect / sectionRecord.totalQs * 100).toFixed(0);
                                    sectionRecord.numberIncorrect = sectionRecord.totalQs - sectionRecord.numberCorrect;
                                    // search for the actual score based on the number of correct answers
                                    var selectedScoreRecord = scoreList.filter(scoreRecord => {
                                        if (scoreRecord.dataValues.section === section && scoreRecord.dataValues.raw === scoreCount[section]) {
                                            return true;
                                        }
                                    });
                                    if (selectedScoreRecord.length > 0) {
                                        sectionRecord.dataValues.score = selectedScoreRecord[0].dataValues.score;
                                    } else {
                                        sectionRecord.dataValues.score = 0;
                                    }
                                });
                                // send the report page, with variables for handlebars
                                res.render('report', {
                                    object: 'object',
                                    questionList: questionList,
                                    sectionList: sectionList
                                });
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).send();
                            });
                    });
            });

    });
};