//require dotenv for env variables
require("dotenv").config();
// Requiring our models for syncing
var db = require("./models");

// Syncing our sequelize models and then starting our Express app
// =============================================================
// { force: true }
db.sequelize.sync().then(function () {
    console.log("db synced");
    db.Question.findAll({
        include: {
            model: db.Test,
            where: {
                id: 1
            }
        },
    }).then(results => {
        console.log(results[0].get({plain:true}));
    });
});