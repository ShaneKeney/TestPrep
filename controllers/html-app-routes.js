// once user is logged in routes for serving various
// html pages (for taking tests, reviewing reports, etc.)

module.exports = (app) => {
    // get list of all exams
    app.get('/reports', (req, res) => {
        var userID = 1
        res.render('report', {
            object: 'object',
            objects: [{
                object1: '1',
                object2: '2',
                object3: '3',
                object4: '4',
                object5: 'SEC > Punctuation > Nonessential Clauses'
            },
            {
                object1: '1',
                object2: '2',
                object3: '3',
                object4: '4',
                object5: 'SEC > Punctuation > Nonessential Clauses'
            }]
        });
    });
};