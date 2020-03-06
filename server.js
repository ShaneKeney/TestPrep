var express = require('express');
var dotenv = require('dotenv');
var db = require('./models');

//Load environment variables if present for development
if(process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

var PORT = process.env.PORT || 3000;

var app = express();

// Serve static content for the app from the "public" directory in the application directory
app.use(express.static('public'));

// Parse application body as JSON
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// Set Handlebars view engine:
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Import routes and give the server access to them
require('./routes/routes')(app);

// Default route for testing and setup:
app.get('/', (req, res) => {
    res.render('index');
});

// Syncing our sequelize models and then starting our Express app
// =============================================================
// { force: true }
db.sequelize.sync().then(function () {
    app.listen(PORT, function() {
        console.log('App listening on PORT ' + PORT);
    });
});