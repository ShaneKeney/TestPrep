module.exports = function (seqeuelize, DataTypes) {
    var Test = seqeuelize.define("Test", {
        type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 140]
            }
        }
    });

    Test.associate = function(models) {
        models.Test.hasMany(models.Question, {
          onDelete: "CASCADE"
        });
    };

    Test.associate = function(models) {
        models.Test.hasMany(models.SatScore, {
            onDelete: "CASCADE"
        });
    };

    return Test;
}