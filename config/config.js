require('dotenv').config();

module.exports = {
    development: {
        username: process.env.DBUSERNAME,
        password: process.env.DBPASS,
        database: process.env.DBNAME,
        host: process.env.DBHOST,
        dialect: 'mysql',
        operatorsAliases: false
    },
    staging: {
        dialect: 'mysql',
        operatorsAliases: false
    },
    production: {
        dialect: 'mysql',
        operatorsAliases: false
    }
};