module.exports = function (sequelize, DataTypes) {
    var SectionResults = sequelize.define('SectionResults', {
        answer_response: {
            type: DataTypes.STRING,
            allowNull: false
        },
        section: {
            type: DataTypes.STRING,
            allowNull: false
        },
    });

    SectionResults.associate = function (models) {
        models.SectionResults.belongsTo(models.Students, {
            onDelete: 'CASCADE',
            foreignKey: {
                allowNull: false
            }
        });

        models.SectionResults.belongsTo(models.Test, {
            onDelete: 'CASCADE',
            foreignKey: {
                allowNull: false
            }
        });

    };

    return SectionResults;
};