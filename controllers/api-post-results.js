// Require db models
const db = require('../models');
const isAuthenticated = require('../middleware/auth');
const updateArr = [];
const createArr = [];

module.exports = (app) => {
    app.post('/api/results', isAuthenticated, function (req, res) {
        db.SectionResultsDetails.findAll({
            where: {
                StudentId: req.body[0].StudentId,
                TestId: req.body[0].TestId
            }
        }).then(prevResults => {
            req.body.forEach(bv => {
                var pushed = false;
                prevResults.forEach(pRv => {
                    if (bv.section === pRv.section && bv.question_number === pRv.question_number) {
                        updateArr.push(bv);
                        pushed = true;
                    }
                });
                if (!pushed) {
                    createArr.push(bv);
                }
            });

            if (updateArr.length > 0) {
                updateArr.forEach(update => {
                    db.SectionResultsDetails.update(update, {
                        where: {
                            TestId: update.TestId,
                            StudentId: update.StudentId,
                            section: update.section,
                            question_number: update.question_number
                        }
                    }).then(results => {
                        console.log(results);
                        updateArr.length = 0;
                        if (createArr.length > 0) {
                            db.SectionResultsDetails.bulkCreate(createArr)
                                .then(function (results) {
                                    res.json(results);
                                });
                            createArr.length = 0;
                        } else {
                            res.json(results);
                        }
                    });
                });

            } else if (createArr.length > 0) {
                db.SectionResultsDetails.bulkCreate(createArr)
                    .then(function (results) {
                        res.json(results);
                    });
                createArr.length = 0;
            }

        });

    });
};