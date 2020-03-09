module.exports = function (sequelize, DataTypes) {
    var Students = sequelize.define('Students', {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true,
            }
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
            type: DataTypes.BIGINT,
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
        console.log(user);
    });

    return Students;
};