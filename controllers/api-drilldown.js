// routes for getting ALL EXAM information, including

// Require db models
const db = require('../models');
const isAuthenticated = require('../middleware/auth');

module.exports = (app) => {

    // get list of all exams
    async function distinctTests() {
        let testList = db.Test.findAll({});
        return testList;
    }

    async function distinctSections() {
        let sectionList = db.Question.findAll({
            attributes: [
                [db.Sequelize.fn('DISTINCT', db.Sequelize.col('section')), 'section']
            ]
        });
        return sectionList;
    }

    async function distinctDifficulty() {
        let difficultyList = db.Question.findAll({
            attributes: [
                [db.Sequelize.fn('DISTINCT', db.Sequelize.col('difficulty')), 'difficulty']
            ]
        });
        return difficultyList;
    }

    async function distinctTagCategory() {
        let tagCategories = db.Question.findAll({
            attributes: [
                [db.Sequelize.fn('DISTINCT', db.Sequelize.col('tag_category')), 'tag_category']
            ]
        });
        return tagCategories;
    }

    async function distinctTagGroup() {
        let tagGroups = db.Question.findAll({
            attributes: [
                [db.Sequelize.fn('DISTINCT', db.Sequelize.col('tag_group')), 'tag_group']
            ]
        });
        return tagGroups;
    }

    app.get('/database', isAuthenticated, async function(req, res) {

        let testList = await distinctTests();
        let sectionList = await distinctSections();
        let difficultyList = await distinctDifficulty();
        let tagCategory = await distinctTagCategory();
        let tagGroup = await distinctTagGroup();

        let query = req.query;

        console.log(query);

        console.log(testList);

        db.Question.findAll({
            where: query,
            order: [
                ['TestId', 'ASC'],
                ['section_position', 'ASC'],
                ['question_number', 'ASC']
            ]
        }).then((questions) => {
            let obj = {
                tests: testList,
                sectionList: sectionList,
                difficulty: difficultyList,
                tagCategory: tagCategory,
                tagGroup: tagGroup,
                questions: questions,
                layout: 'database'
            };
            // console.log(obj);
            // res.json(obj);
            res.render('drilldown', obj);

        });
    });
};