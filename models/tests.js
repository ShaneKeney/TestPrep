module.exports = function (seqeuelize, DataTypes) {
    var Test = seqeuelize.define('Test', {
        type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        exam: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 140]
            }
        }
    });

    Test.associate = function (models) {
        models.Test.hasMany(models.Question, {
            onDelete: 'CASCADE'
        });
        models.Test.hasMany(models.SatCurve, {
            onDelete: 'CASCADE'
        });
    };

    return Test;
};