/* eslint-disable camelcase */
module.exports = function (sequelize, DataTypes) {
    var SectionResultsDetails = sequelize.define('SectionResultsDetails', {
        exam: {
            type: DataTypes.STRING,
            allowNull: false
        },
        section: {
            type: DataTypes.STRING,
            allowNull: false
        },
        question_number: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
                max: 75
            }
        },
        answer_response: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    SectionResultsDetails.associate = function (models) {
        models.SectionResultsDetails.belongsTo(models.Students, {
            onDelete: 'CASCADE',
            foreignKey: {
                allowNull: false
            }
        });
    };

    SectionResultsDetails.associate = function (models) {
        models.SectionResultsDetails.belongsTo(models.Students, {
            onDelete: 'CASCADE',
            foreignKey: {
                allowNull: false
            }
        });
    };

    SectionResultsDetails.associate = function (models) {
        models.SectionResultsDetails.belongsTo(models.Test, {
            onDelete: 'CASCADE',
            foreignKey: {
                allowNull: false
            }
        });
    };

    return SectionResultsDetails;
};