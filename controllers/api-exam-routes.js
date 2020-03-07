// routes for getting exam information, including
// questions detail and scoring information



// Require db models
const db = require('../models');


module.exports = (app) => {
    app.use('/');
    // EX: app.use("specify base route path", specify imported router);
    // list any other routers in same fashion as above
    app.get('/api/exams',(req,res)=>{
        db.Test.findAll()
            .then((tests)=>{
                res.json(tests);
            });
    });
};