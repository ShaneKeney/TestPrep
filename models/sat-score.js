module.exports = function (seqeuelize, DataTypes) {
    var SatScore = seqeuelize.define('SatScore', {
        sat_test: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 50]
            }
        },
        sat_section: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 50]
            }
        },
        raw: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 0,
                max: 58
            }
        },
        score: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 10,
                max: 800
            }
        }
    });

    SatScore.associate = function (models) {
        models.SatScore.belongsTo(models.Test, {
            onDelete: 'CASCADE',
            foreignKey: {
                allowNull: false
            }
        });
    };

    return SatScore;
};