// routes for getting exam information, including
// questions detail and scoring information

// Require db models
const db = require('../models');


module.exports = (app) => {
    // get list of all exams
    app.get('/api/exams',(req,res)=>{
        db.Test.findAll()
            .then((tests)=>{
                res.json(tests);
            });
    });
    // get all questions of one  section of specific exam
    app.get('/api/exams/:examID/:section',(req,res)=>{
        db.
    })

};