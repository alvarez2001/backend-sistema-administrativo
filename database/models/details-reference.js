const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../db");

class DetailsReferences extends Model {}

DetailsReferences.init(
	{
		concept: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		accountOrigin: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{
		sequelize,
		modelName: "details_references",
	},
);

module.exports = DetailsReferences;
