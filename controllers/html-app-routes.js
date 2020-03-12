// once user is logged in routes for serving various
// html pages (for taking tests, reviewing reports, etc.)

// Require db models
const db = require('../models');
const isAuthenticated = require('../middleware/auth');

module.exports = (app) => {
    // get get report of exam results taken by a student
    app.get('/reports/:StudentId/:TestId/:section', isAuthenticated, (req, res) => {
        const StudentId = req.params.StudentId;
        const TestId = req.params.TestId;
        var sectionFilter = req.params.section;
        if(sectionFilter === 'mathNC' || sectionFilter === 'mathC') {
            sectionFilter = 'math';
        }
        var resultDetails;
        var sectionList;
        var questionList;
        var scoreList;
        var scoreCount = {};
        var skippedCount = {};
        var easyCorrect = {};
        var medCorrect = {};
        var hardCorrect = {};
        var tagWrong = {};
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
                                    function createPropOn(obj, name) {
                                        if (!obj[name]) {
                                            obj[name] = 0;
                                        }
                                    }
                                    createPropOn(scoreCount, modSection);
                                    createPropOn(skippedCount, modSection);
                                    createPropOn(easyCorrect, modSection);
                                    createPropOn(medCorrect, modSection);
                                    createPropOn(hardCorrect, modSection);
                                    createPropOn(tagWrong, modSection);
                                    tagWrong[modSection] === 0 ? tagWrong[modSection] = {} : false;
                                    createPropOn(tagWrong[modSection], question.dataValues.tag_category);

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
                                        tagWrong[modSection][question.dataValues.tag_category] += 1;
                                    } else {
                                        question.omitted = true;
                                        tagWrong[modSection][question.dataValues.tag_category] += 1;
                                        skippedCount[modSection] += 1;
                                        // set a dash to display if it was skipped
                                        question.dataValues.studentAnswer = '-';
                                    }
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
                                        if (sectionFilter !== 'all') {
                                            sectionList = sectionList.filter(sectionRecord => {
                                                if (sectionRecord.dataValues.section === sectionFilter) {
                                                    return true;
                                                }
                                            });
                                            if (sectionList.length === 0) {
                                                throw new Error(`the section: ${sectionFilter} does not exist for the test with ID: ${TestId})`);
                                            }
                                        }
                                        sectionList.forEach(sectionRecord => {
                                            var section = sectionRecord.dataValues.section;
                                            // function to count questions based on certain criteria
                                            function countQ(val, field) {
                                                return questionList.filter(item => {
                                                    if (item.dataValues[field] === val
                                                        && item.dataValues.modSection === section) {
                                                        return true;
                                                    } else {
                                                        return false;
                                                    }
                                                }).length;
                                            }
                                            sectionRecord.sortedTagsWrong = Object.keys(tagWrong[section]).sort(function (a, b) {
                                                return tagWrong[section][b] - tagWrong[section][a];
                                            }).slice(0, 2);
                                            sectionRecord.easyCount = countQ('e', 'difficulty');
                                            sectionRecord.medCount = countQ('m', 'difficulty');
                                            sectionRecord.hardCount = countQ('h', 'difficulty');
                                            sectionRecord.tagWrong1Count = countQ(sectionRecord.sortedTagsWrong[0], 'tag_category');
                                            sectionRecord.tagWrong2Count = countQ(sectionRecord.sortedTagsWrong[1], 'tag_category');
                                            sectionRecord.correctTagWrong1Count = questionList.filter(q => {
                                                if (q.dataValues.tag_category === sectionRecord.sortedTagsWrong[0]
                                                    && q.dataValues.modSection === section
                                                    && q.wrong === false) {
                                                    return true;
                                                }
                                            }).length;
                                            sectionRecord.correctTagWrong2Count = questionList.filter(q => {
                                                if (q.dataValues.tag_category === sectionRecord.sortedTagsWrong[1]
                                                    && q.dataValues.modSection === section
                                                    && q.wrong === false) {
                                                    return true;
                                                }
                                            }).length;

                                            function getNums(iter) {
                                                var wrongNums = [];
                                                questionList.forEach(q => {
                                                    if (q.dataValues.tag_category === sectionRecord.sortedTagsWrong[iter]
                                                        && q.dataValues.modSection === section
                                                        && q.wrong === true) {
                                                        wrongNums.push(' ' + q.dataValues.question_number);
                                                    }
                                                });
                                                return wrongNums;
                                            }
                                            sectionRecord.tagWrong1Missed = getNums(0);
                                            sectionRecord.tagWrong2Missed = getNums(1);
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
                                    }).catch(err => {
                                        console.log(err);
                                        res.status(500).send();
                                    });
                            });

                    });
            });

    });
};