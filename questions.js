module.exports = function (seqeuelize, DataTypes) {
    var Question = seqeuelize.define('Question', {
        exam: {
            type: DataTypes.STRING,
            allowNull: false
        },
        section: {
            type: DataTypes.STRING,
            allowNull: false
        },
        section_position: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
                max: 5
            }
        },
        question_number: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
                max: 75
            }
        },
        difficulty: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isIn: [['e', 'm', 'h']]
            }
        },
        question_type: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isIn: [['mc', 'arr', 'range']]
            }
        },
        ans_actual: {
            type: DataTypes.STRING,
            allowNull: false
        },
        tag_category: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1,140]
            }
        },
        tag_group: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1,140]
            }
        },
        tag: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                len: [1,140]
            }
        }
    });

    Question.associate = function (models) {
        models.Question.belongsTo(models.Test, {
            onDelete: 'CASCADE',
            foreignKey: {
                allowNull: false
            }
        });
    };

    return Question;
};