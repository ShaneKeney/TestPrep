const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = function (sequelize, DataTypes) {
    var Students = sequelize.define('Students', {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true,
            },
            unique: true
        },
        first_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                min: 1,
                max: 75
            }
        },
        phone: {
            type: DataTypes.STRING,
        },
        tokens: { 
            type: DataTypes.STRING,
            defaultValue: null
        }
    });

    Students.associate = function (models) {
        models.Students.hasMany(models.SectionResults, {
            onDelete: 'CASCADE'
        });

        models.Students.hasMany(models.SectionResultsDetails, {
            onDelete: 'CASCADE'
        });
    };

    // Run code just before Student/User is created
    Students.beforeCreate(async (user, options) => {
        //console.log(user);
    });

    Students.prototype.generateAuthToken = async function() {
        const user = this;
        console.log(user)
        const token = jwt.sign({id: user.id.toString()}, 'thisisasecret'); //TODO: change this to process.env 

        user.tokens = token;
        await user.save();

        return token;
    }

    Students.findByCredentials = async (email, password) => {
        const userArray = await Students.findAll({
            where: {
                email: email
            }
        });

        const user = userArray[0];
        // console.log(user.dataValues.email)
        // console.log(user.dataValues.password)

        if(!user) {
            throw new Error('Unable to login')
        }

        const isMatch = await bcrypt.compare(password, user.dataValues.password);
        if(!isMatch) {
            console.log('Password mismatch')
            throw new Error('Unable to login!');
        }

        return user;
    }

    return Students;
};